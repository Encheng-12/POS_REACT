import { useEffect, useState } from 'react'
import {
  Table,
  App,
  Space,
  Typography,
  Card,
  Input,
  Avatar,
  Tag,
  Button,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
  InputNumber,
  Select,
} from 'antd'
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserAddOutlined,
} from '@ant-design/icons'

const { Text } = Typography
const apiurl = import.meta.env.VITE_API_URL
const API_URL = apiurl + '/users'

const ROLE_COLOR = { Admin: 'purple', Manager: 'blue', Cashier: 'default' }
const STATUS_COLOR = { active: 'success', inactive: 'default', suspended: 'error' }

function initials(name = '') {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function UserTable() {
  const { message, modal } = App.useApp()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50'],
    showTotal: (total) => `${total} users`,
  })

  // --- Create / Edit modal state ---
  const [formOpen, setFormOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null) // null = creating new
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()

  const fetchUsers = async (page = 1, pageSize = 10, sorter = {}) => {
    setLoading(true)
    try {
      const skip = (page - 1) * pageSize
      const sortField = sorter.field || ''
      const sortOrder = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : ''

      const params = new URLSearchParams({ skip, limit: pageSize })
      if (sortField) {
        params.set('sortBy', sortField)
        params.set('order', sortOrder)
      }

      const response = await fetch(`${API_URL}?${params.toString()}`)
      const result = await response.json()

      setData(result.data || [])
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
        total: result.total || 0,
      }))
    } catch (error) {
      console.error('Failed to fetch users:', error)
      message.error('Failed to load user data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTableChange = (newPagination, _filters, sorter) => {
    fetchUsers(newPagination.current, newPagination.pageSize, sorter)
  }

  const handleView = (record) => {
    modal.info({
      title: record.name,
      content: (
        <div style={{ marginTop: 8 }}>
          <p><Text type="secondary">Email:</Text> {record.email}</p>
          <p><Text type="secondary">Phone:</Text> {record.phone_number}</p>
          <p><Text type="secondary">Address:</Text> {record.address?.address}</p>
          <p><Text type="secondary">Role:</Text> {record.role}</p>
          <p><Text type="secondary">Status:</Text> {record.status}</p>
        </div>
      ),
    })
  }

  // ---------- Create ----------
  const openCreate = () => {
    setEditingRecord(null)
    form.resetFields()
    setFormOpen(true)
  }

  // ---------- Edit ----------
  const openEdit = (record) => {
    setEditingRecord(record)
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      age: record.age,
      phone_number: record.phone_number,
      address: record.address?.address,
      role: record.role,
      status: record.status,
    })
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingRecord(null)
    form.resetFields()
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        name: values.name,
        email: values.email,
        age: values.age,
        phone_number: values.phone_number,
        address: { address: values.address },
        role: values.role,
        status: values.status,
      }

      setSaving(true)
      if (editingRecord) {
        // UPDATE
        const res = await fetch(`${API_URL}/${editingRecord.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Update failed')
        message.success(`${values.name} was updated`)
      } else {
        // CREATE
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Create failed')
        message.success(`${values.name} was added`)
      }

      closeForm()
      fetchUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      if (error?.errorFields) return // antd validation error — fields already show inline errors
      console.error('Failed to save user:', error)
      message.error(editingRecord ? 'Failed to update user.' : 'Failed to create user.')
    } finally {
      setSaving(false)
    }
  }

  // ---------- Delete ----------
  const handleDelete = async (record) => {
    try {
      const res = await fetch(`${API_URL}/${record.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      message.success(`${record.name} was deleted`)
      fetchUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('Failed to delete user:', error)
      message.error('Failed to delete user.')
    }
  }

  const filteredData = searchText
    ? data.filter((u) =>
        [u.name, u.email, u.role].join(' ').toLowerCase().includes(searchText.toLowerCase())
      )
    : data

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      sorter: true,
      render: (name, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#5B5FEF', flexShrink: 0 }}>{initials(name)}</Avatar>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontWeight: 600 }}>{name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      sorter: true,
      width: 80,
      align: 'center',
    },
    {
      title: 'Address',
      dataIndex: ['address', 'address'],
      ellipsis: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phone_number',
      sorter: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      sorter: true,
      render: (role) => <Tag color={ROLE_COLOR[role] || 'default'}>{role}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
      render: (status) => (
        <Tag color={STATUS_COLOR[status] || 'default'} style={{ textTransform: 'capitalize' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Delete this user?"
            description={`This will remove ${record.name} permanently.`}
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record)}
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title="Users"
      extra={
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={openCreate}
          style={{ backgroundColor: '#10B981', borderColor: '#10B981', color: '#fff' }}
        >
          Add user
        </Button>
      }
      styles={{ body: { paddingTop: 12 } }}
    >
      <Input
        placeholder="Search by name, email or role…"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ maxWidth: 320, marginBottom: 16 }}
        allowClear
      />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 960 }}
        rowClassName={(_, i) => (i % 2 === 1 ? 'row-alt' : '')}
      />
      <style>{`
        .row-alt td { background: #fafafa; }
        .ant-table-thead > tr > th { background: #f5f5f5 !important; font-weight: 600; }
      `}</style>

      {/* Create / Edit modal */}
      <Modal
        title={editingRecord ? `Edit ${editingRecord.name}` : 'Add user'}
        open={formOpen}
        onCancel={closeForm}
        onOk={handleSave}
        okText={editingRecord ? 'Save changes' : 'Create user'}
        confirmLoading={saving}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Full name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="e.g. Sokha Ry" />
          </Form.Item>

          <Space.Compact block>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
              style={{ flex: 2, marginRight: 8 }}
            >
              <Input placeholder="name@company.com" />
            </Form.Item>
            <Form.Item name="age" label="Age" style={{ flex: 1 }}>
              <InputNumber min={16} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Space.Compact>

          <Form.Item name="phone_number" label="Phone number">
            <Input placeholder="e.g. 012 345 678" />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input placeholder="Street, city" />
          </Form.Item>

          <Space.Compact block>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Role is required' }]}
              style={{ flex: 1, marginRight: 8 }}
            >
              <Select
                placeholder="Select a role"
                options={[
                  { value: 'Admin', label: 'Admin' },
                  { value: 'Manager', label: 'Manager' },
                  { value: 'Cashier', label: 'Cashier' },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Status is required' }]}
              style={{ flex: 1 }}
            >
              <Select
                placeholder="Select a status"
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'suspended', label: 'Suspended' },
                ]}
              />
            </Form.Item>
          </Space.Compact>
        </Form>
      </Modal>
    </Card>
  )
}

export default UserTable