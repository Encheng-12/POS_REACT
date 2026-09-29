import { Card, Tag, Typography, Flex } from 'antd'
import { EyeOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

function OrderCard({ order, onView }) {
  if (!order) return null

  // Status tag styling helper
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

  return (
    <Card
      hoverable
      style={{
        borderRadius: 12,
        borderColor: '#e5e7eb',
        height: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px',
          height: '100%',
        },
      }}
      onClick={() => onView && onView(order)}
    >
      <div>
        {/* Header: Invoice & Status */}
        <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
          <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
            {order.invoice}
          </Title>
          {renderStatusTag(order.status)}
        </Flex>

        {/* Customer & Cashier Info */}
        <Flex vertical gap="xs" style={{ marginBottom: 16 }}>
          <Flex justify="space-between">
            <Text type="secondary">Customer:</Text>
            <Text strong>{order.customer || 'Walk-in'}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text type="secondary">Cashier:</Text>
            <Text>{order.cashier || '-'}</Text>
          </Flex>
        </Flex>
      </div>

      {/* Footer: Price Summary */}
      <div style={{ paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
        <Flex justify="space-between" align="center">
          <Text type="secondary">Total</Text>
          <Title level={4} style={{ margin: 0, color: '#10b981' }}>
            ${Number(order.total || 0).toFixed(2)}
          </Title>
        </Flex>
      </div>
    </Card>
  )
}

export default OrderCard