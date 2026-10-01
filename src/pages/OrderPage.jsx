import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import {
  Typography,
  Button,
  Tag,
  Table,
  Card,
  Flex,
  Drawer,
  Row,
  Col,
  Segmented,
  Spin,
  Pagination,
  App,
} from 'antd'
import {
  PlusOutlined,
  EyeOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import OrderCard from '../components/OrderCard.jsx'
import { getOrders, getUserById } from '../services/orderapi.js'

const { Title, Text } = Typography

function OrdersPage() {
  const navigate = useNavigate()
  const { message } = App.useApp()

  // State Management
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'cards'

  // Dynamic Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalOrders, setTotalOrders] = useState(0)

  // Fetch orders from API
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      const { orders: fetchedOrders, pagination } = await getOrders({
        page: currentPage,
        perPage: pageSize,
      })
      setOrders(fetchedOrders)
      setTotalOrders(pagination.total)
      setCurrentPage(pagination.currentPage)
    } catch (error) {
      message.error(error.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, message])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handlePaginationChange = (page, newPageSize) => {
    setCurrentPage(page)
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize)
      setCurrentPage(1)
    }
  }

  const handleViewOrder = async (order) => {
    setSelectedOrder(order)
    setDrawerOpen(true)

    // Dynamically fetch customer details if customer ID exists but name is missing
    if (order.customerId && !order.customer?.name) {
      const user = await getUserById(order.customerId)
      if (user) {
        setSelectedOrder((prev) =>
          prev && prev.id === order.id
            ? { ...prev, customer: user, customerName: user.name }
            : prev
        )
      }
    }

    // Dynamically fetch cashier details if cashier ID exists but name is missing
    if (order.cashierId && !order.cashierName) {
      const cashier = await getUserById(order.cashierId)
      if (cashier) {
        setSelectedOrder((prev) =>
          prev && prev.id === order.id
            ? { ...prev, cashierName: cashier.name }
            : prev
        )
      }
    }
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedOrder(null)
  }

  // Color map helper for order statuses
  const renderStatusTag = (status) => {
    const statusMap = {
      Completed: { color: 'success' },
      Paid: { color: 'success' },
      Pending: { color: 'warning' },
      Cancelled: { color: 'error' },
      Refunded: { color: 'error' },
    }
    const { color } = statusMap[status] || { color: 'default' }

    return (
      <Tag
        color={color}
        style={{
          borderRadius: 12,
          padding: '2px 10px',
          fontWeight: 500,
        }}
      >
        {status}
      </Tag>
    )
  }

  // Table Columns Definition mapping to API fields
  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      render: (text, record) => (
        <Text style={{ color: '#333', fontWeight: 600 }}>
          {text || record.invoice || `INV-${record.id}`}
        </Text>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer, record) =>
        customer?.name || record.customerName || (record.customerId ? `User #${record.customerId}` : 'Walk-in'),
    },
    {
      title: 'Cashier ID',
      dataIndex: 'cashierId',
      key: 'cashierId',
      render: (id, record) =>
        record.cashierName ? record.cashierName : id ? `Cashier #${id}` : '-',
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (val) => `$${Number(val || 0).toFixed(2)}`,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (val) => `$${Number(val || 0).toFixed(2)}`,
    },
    {
      title: 'Tax',
      dataIndex: 'tax',
      key: 'tax',
      render: (val) => `$${Number(val || 0).toFixed(2)}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (val) => <strong>${Number(val || 0).toFixed(2)}</strong>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => renderStatusTag(status),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewOrder(record)}
          style={{ borderRadius: 6 }}
        >
          View
        </Button>
      ),
    },
  ]

  // Drawer Line Items Columns
  const lineItemColumns = [
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    {
      title: 'Unit',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (val) => `$${Number(val || 0).toFixed(2)}`,
    },
    {
      title: 'Disc.',
      dataIndex: 'discount',
      key: 'discount',
      render: (val) => `$${Number(val || 0).toFixed(2)}`,
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (val) => `$${Number(val || 0).toFixed(2)}`,
    },
  ]

  return (
    <div style={{ padding: '24px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      {/* Header Bar */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
            Orders
          </Title>
          <Text type="secondary">{totalOrders} orders total</Text>
        </div>

        <Flex gap="middle" align="center">
          <Segmented
            options={[
              { value: 'table', icon: <UnorderedListOutlined /> },
              { value: 'cards', icon: <AppstoreOutlined /> },
            ]}
            value={viewMode}
            onChange={(val) => setViewMode(val)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={{
              backgroundColor: '#10b981',
              borderColor: '#10b981',
              borderRadius: 6,
              fontWeight: 500,
            }}
            onClick={() => navigate('/sales/new')}
          >
            New sale
          </Button>
        </Flex>
      </Flex>

      {/* Main Content Layout (Table or Cards Grid) */}
      <Spin spinning={loading}>
        {viewMode === 'table' ? (
          <Card
            variant="borderless"
            styles={{ body: { padding: 0 } }}
            style={{ borderRadius: 12, overflow: 'hidden' }}
          >
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              pagination={false}
            />
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {orders.map((order) => (
              <Col xs={24} sm={12} md={8} lg={6} key={order.id}>
                <OrderCard order={order} onView={handleViewOrder} />
              </Col>
            ))}
          </Row>
        )}
      </Spin>

      {/* Dynamic API Pagination Footer */}
      {totalOrders > pageSize && (
        <Flex justify="center" style={{ marginTop: 24 }}>
          <Pagination
            current={currentPage}
            total={totalOrders}
            pageSize={pageSize}
            showSizeChanger
            pageSizeOptions={['10', '20', '50']}
            onChange={handlePaginationChange}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} orders`}
          />
        </Flex>
      )}

      {/* Detail Pop-up Drawer */}
      <Drawer
        title={
          <Title level={4} style={{ margin: 0 }}>
            {selectedOrder?.invoiceNo || selectedOrder?.invoice || `INV-${selectedOrder?.id}`}
          </Title>
        }
        placement="right"
        style={{ maxWidth: '100vw' }}
        styles={{ body: { padding: '20px' } }}
        onClose={handleCloseDrawer}
        open={drawerOpen}
      >
        {selectedOrder && (
          <Flex vertical gap="middle">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text type="secondary">Customer</Text>
                <div>
                  <strong>
                    {selectedOrder.customer?.name ||
                      selectedOrder.customerName ||
                      (selectedOrder.customerId ? `User #${selectedOrder.customerId}` : 'Walk-in')}
                  </strong>
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Cashier</Text>
                <div>
                  <strong>
                    {selectedOrder.cashierName ||
                      (selectedOrder.cashierId ? `Cashier #${selectedOrder.cashierId}` : '-')}
                  </strong>
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Status</Text>
                <div>{renderStatusTag(selectedOrder.status)}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Total</Text>
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    ${Number(selectedOrder.total || 0).toFixed(2)}
                  </Title>
                </div>
              </Col>
            </Row>

            <Text strong style={{ marginTop: 12 }}>
              Line items
            </Text>
            <Table
              columns={lineItemColumns}
              dataSource={selectedOrder.items || []}
              rowKey={(item, index) => item.id || index}
              pagination={false}
              size="small"
            />

            <Flex vertical gap="small" style={{ marginTop: 8 }}>
              <Flex justify="space-between">
                <Text type="secondary">Subtotal</Text>
                <Text>${Number(selectedOrder.subtotal || 0).toFixed(2)}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text type="secondary">Discount</Text>
                <Text>-${Number(selectedOrder.discount || 0).toFixed(2)}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text type="secondary">Tax</Text>
                <Text>${Number(selectedOrder.tax || 0).toFixed(2)}</Text>
              </Flex>
              <Flex
                justify="space-between"
                align="center"
                style={{
                  marginTop: 8,
                  borderTop: '1px dashed #d9d9d9',
                  paddingTop: 8,
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Total
                </Title>
                <Title level={4} style={{ margin: 0 }}>
                  ${Number(selectedOrder.total || 0).toFixed(2)}
                </Title>
              </Flex>
            </Flex>

            <Text strong style={{ marginTop: 12 }}>
              Payment
            </Text>
            <Card
              variant="borderless"
              style={{ borderRadius: 8, backgroundColor: '#fafafa' }}
              styles={{ body: { padding: 16 } }}
            >
              <Flex vertical gap="small">
                <Flex justify="space-between">
                  <Text type="secondary">Method</Text>
                  <Text>{selectedOrder.payment?.method || 'Cash'}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text type="secondary">Reference no.</Text>
                  <Text>{selectedOrder.payment?.referenceNo || '-'}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text type="secondary">Paid at</Text>
                  <Text>{selectedOrder.payment?.paidAt || '-'}</Text>
                </Flex>
              </Flex>
            </Card>
          </Flex>
        )}
      </Drawer>
    </div>
  )
}

export default OrdersPage