import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Typography, Button, Tag, Table, Card, Flex, Drawer, Row, Col, Segmented } from 'antd'
import { PlusOutlined, EyeOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons'
import OrderCard from '../components/OrderCard.jsx'

const { Title, Text } = Typography

function OrdersPage({ orders = [] }) {
  const navigate = useNavigate()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'cards'

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedOrder(null)
  }

  // Color map helper for order statuses
  const renderStatusTag = (status) => {
    const statusMap = {
      Paid: { color: 'success' },
      Refunded: { color: 'error' },
      Pending: { color: 'warning' },
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

  // Main Table Columns Definition
  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'invoice',
      key: 'invoice',
      render: (text) => <Text style={{ color: '#333' }}>{text}</Text>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Cashier',
      dataIndex: 'cashier',
      key: 'cashier',
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
    { title: 'Unit', dataIndex: 'unitPrice', key: 'unitPrice', render: (val) => `$${Number(val || 0).toFixed(2)}` },
    { title: 'Disc.', dataIndex: 'discount', key: 'discount', render: (val) => `$${Number(val || 0).toFixed(2)}` },
    { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal', render: (val) => `$${Number(val || 0).toFixed(2)}` },
  ]

  return (
    <div style={{ padding: '24px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      {/* Top Bar Header */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
            Orders
          </Title>
          <Text type="secondary">{orders.length} orders</Text>
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
      {viewMode === 'table' ? (
        <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey={(record) => record.id || record.invoice}
            pagination={false}
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {orders.map((order) => (
            <Col xs={24} sm={12} md={8} lg={6} key={order.id || order.invoice}>
              <OrderCard order={order} onView={handleViewOrder} />
            </Col>
          ))}
        </Row>
      )}

      {/* Detail Pop-up Drawer (Right side) */}
      <Drawer
        title={<Title level={4} style={{ margin: 0 }}>{selectedOrder?.invoice}</Title>}
        placement="right"
        width={480}
        onClose={handleCloseDrawer}
        open={drawerOpen}
        bodyStyle={{ padding: '20px' }}
      >
        {selectedOrder && (
          <Flex vertical gap="middle">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text type="secondary">Customer</Text>
                <div><strong>{selectedOrder.customer}</strong></div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Cashier</Text>
                <div><strong>{selectedOrder.cashier}</strong></div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Status</Text>
                <div>{renderStatusTag(selectedOrder.status)}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Total</Text>
                <div><Title level={4} style={{ margin: 0 }}>${Number(selectedOrder.total || 0).toFixed(2)}</Title></div>
              </Col>
            </Row>

            <Text strong style={{ marginTop: 12 }}>Line items</Text>
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
              <Flex justify="space-between" align="center" style={{ marginTop: 8, borderTop: '1px dashed #d9d9d9', paddingTop: 8 }}>
                <Title level={4} style={{ margin: 0 }}>Total</Title>
                <Title level={4} style={{ margin: 0 }}>${Number(selectedOrder.total || 0).toFixed(2)}</Title>
              </Flex>
            </Flex>

            <Text strong style={{ marginTop: 12 }}>Payment</Text>
            <Card style={{ borderRadius: 8, backgroundColor: '#fafafa' }} bodyStyle={{ padding: 16 }}>
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