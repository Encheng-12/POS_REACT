import { useEffect, useState } from 'react'
import { Table, App, Space, Divider, Typography } from 'antd'
const { Link } = Typography

// Columns for server-side table (set sorter: true instead of a client compare function)
const columns = [
  {
    title: 'ID',
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    sorter: true,
  },
  {
    title: 'Address',
    dataIndex: ['address', 'address'],
  },
  {
    title: 'Phone Number',
    dataIndex: 'phone_number',
    sorter: true,
  },
  {
    title: 'Role',
    dataIndex: 'role',
    sorter: true,
  },
  {
    title: 'Status',
    title: 'status',
    sorter: true,
  },
{
    title: 'Action',
    key: 'action',
    render: (_, record) => (
        <Space >
            <Link onClick={() => handleView(record)}>View</Link>
            <Link onClick={() => handleEdit(record)}>Update</Link>
            <Link type="danger" onClick={() => handleDelete(record)}>Delete</Link>
        </Space>
    ),
    }
]

function UserTable() {
  const { message } = App.useApp()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50'],
  })

  // Function to fetch data from your API
  const fetchUsers = async (page = 1, pageSize = 10, sorter = {}) => {
    setLoading(true)
    try {
      const skip = (page - 1) * pageSize
      const sortField = sorter.field || ''
      const sortOrder = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : ''

      let url = `http://127.0.0.1:9000/api/users`
      if (sortField) {
        url += `&sortBy=${sortField}&order=${sortOrder}`
      }

      const response = await fetch(url)
      const result = await response.json()

      setData(result || [])
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: result.total || 0,
      }))
    } catch (error) {
      console.error('Failed to fetch users:', error)
      message.error('Failed to load user data.')
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize)
  }, [])

  // Handle page change, page size change, and sorting
  const handleTableChange = (newPagination, filters, sorter) => {
    fetchUsers(newPagination.current, newPagination.pageSize, sorter)
  }

  return (
    <Table
      rowKey="id" // or 'key', matching unique database primary key
      columns={columns}
      dataSource={data}
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  )
}

export default UserTable