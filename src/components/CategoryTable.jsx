import { useEffect, useState } from 'react'
import {
  Table,
  App,
  Space,
  Typography,
  Card,
  Input,
  Avatar,
  Button,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
} from 'antd'
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  TagOutlined,
  PlusOutlined,
} from '@ant-design/icons'

const { Text } = Typography
const apiurl = import.meta.env.VITE_API_URL
const API_URL = apiurl + '/categories'

const COLORS = ['#14B8A6', '#F59E0B', '#EC4899', '#2F6FED', '#7C4DFF', '#22C55E']

function CategoryTable() {
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
    showTotal: (total) => `${total} categories`,
  })

  // --- Create / Edit modal state ---
  const [formOpen, setFormOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null) // null = creating new
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()

  const fetchCategories = async (page = 1, pageSize = 10, sorter = {}) => {
    setLoading(true)
    try {
      const skip = (page - 1) * pageSize
      const sortField = sorter.field || ''
      const sortOrder = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : ''

      const params = new URLSearchParams({ skip, limit: pageSize })
      if (sortField) {
        params.set('sortby', sortField)
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
      console.error('Failed to fetch categories:', error)
      message.error('Failed to load category data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories(pagination.current, pagination.pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTableChange = (newPagination, _filters, sorter) => {
    fetchCategories(newPagination.current, newPagination.pageSize, sorter)
  }

  const handleView = (record) => {
    modal.info({
      title: record.name,
      content: (
        <div style={{ marginTop: 8 }}>
          <p><Text type="secondary">Description:</Text> {record.description || '—'}</p>
          {record.created_at && (
            <p><Text type="secondary">Created:</Text> {record.created_at}</p>
          )}
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
      description: record.description,
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
        description: values.description,
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
      fetchCategories(pagination.current, pagination.pageSize)
    } catch (error) {
      if (error?.errorFields) return // antd validation error — fields already show inline errors
      console.error('Failed to save category:', error)
      message.error(editingRecord ? 'Failed to update category.' : 'Failed to create category.')
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
      fetchCategories(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('Failed to delete category:', error)
      // A FK constraint (category still has products) is the most common
      // reason this fails — surface that possibility to the user.
      message.error('Failed to delete category. It may still have products linked to it.')
    }
  }

  const filteredData = searchText
    ? data.filter((c) =>
        [c.name, c.description].join(' ').toLowerCase().includes(searchText.toLowerCase())
      )
    : data

  const columns = [
    {
      title: 'Category',
      dataIndex: 'name',
      sorter: true,
      render: (name, record, index) => (
        <Space>
          <Avatar
            shape="square"
            style={{ backgroundColor: `${COLORS[index % COLORS.length]}1A`, color: COLORS[index % COLORS.length], borderRadius: 8 }}
            icon={<TagOutlined />}
          />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: true,
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
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
            title="Delete this category?"
            description={`This will remove "${record.name}" permanently.`}
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
      title="Categories"
      extra={
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={openCreate}
        style={{ backgroundColor: '#10B981', borderColor: '#10B981', color: '#fff' }}
        >
          New category
      </Button>}
      styles={{ body: { paddingTop: 12 } }}
    >
      <Input
        placeholder="Search by name or description…"
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
        rowClassName={(_, i) => (i % 2 === 1 ? 'row-alt' : '')}
      />
      <style>{`
        .row-alt td { background: #fafafa; }
        .ant-table-thead > tr > th { background: #f5f5f5 !important; font-weight: 600; }
      `}</style>

      {/* Create / Edit modal */}
      <Modal
        title={editingRecord ? `Edit ${editingRecord.name}` : 'New category'}
        open={formOpen}
        onCancel={closeForm}
        onOk={handleSave}
        okText={editingRecord ? 'Save changes' : 'Create category'}
        confirmLoading={saving}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Category name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="e.g. Beverages" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="e.g. Soft drinks, juices & water" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default CategoryTable