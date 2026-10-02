import { Card, Tag, Typography, Flex, Divider } from 'antd'

const { Title, Text } = Typography

function OrderCard({ order, onView }) {
  if (!order) return null

  // Customer display name resolution
  const customerName =
    order.customer?.name ||
    order.customerName ||
    (typeof order.customer === 'string' ? order.customer : 'Walk-in')

  // Cashier display name resolution
  const cashierName =
    order.cashierName ||
    (order.cashierId ? `Cashier #${order.cashierId}` : '-')

  // Get items list from mapOrderData mapping (handles items or order_products)
  const items = Array.isArray(order.items) ? order.items : []
  
  // Calculate total quantity of items across all line items
  const totalQuantity = items.reduce(
    (sum, item) => sum + (Number(item.quantity || item.qty) || 0),
    0
  )

  // Status tag styling helper
  const renderStatusTag = (status) => {
    const statusMap = {
      Completed: { color: 'success' },
      Paid: { color: 'success' },
      Refunded: { color: 'error' },
      Cancelled: { color: 'error' },
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
        {status || 'Pending'}
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
            {order.invoiceNo || order.invoice || `INV-${order.id}`}
          </Title>
          {renderStatusTag(order.status)}
        </Flex>

        {/* Customer & Cashier Details */}
        <Flex vertical gap="xs" style={{ marginBottom: 12 }}>
          <Flex justify="space-between">
            <Text type="secondary">Customer:</Text>
            <Text strong>{customerName}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text type="secondary">Cashier:</Text>
            <Text>{cashierName}</Text>
          </Flex>
        </Flex>

        <Divider style={{ margin: '8px 0' }} />

        {/* Product Line Items Summary */}
        <Flex vertical gap="xs" style={{ marginBottom: 12 }}>
          <Flex justify="space-between" align="center">
            <Text type="secondary">Items ({items.length} types):</Text>
            <Text type="secondary">{totalQuantity} units total</Text>
          </Flex>

          {/* Render top 2 line items */}
          {items.slice(0, 2).map((item) => (
            <Flex key={item.id} justify="space-between" align="center">
              <Text ellipsis style={{ maxWidth: '65%' }}>
                {item.productName || item.product?.name }
              </Text>
              <Text type="secondary">
                x{item.quantity || item.qty} @ ${Number(item.unitPrice).toFixed(2)}
              </Text>
            </Flex>
          ))}

          {/* Indicate if there are additional products in the order */}
          {items.length > 2 && (
            <Text type="secondary" style={{ fontSize: 12, italic: true }}>
              +{items.length - 2} more product{items.length - 2 > 1 ? 's' : ''}...
            </Text>
          )}
        </Flex>
      </div>

      {/* Footer: Pricing Breakdown */}
      <div style={{ paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
        {order.discount > 0 && (
          <Flex justify="space-between" style={{ marginBottom: 4 }}>
            <Text type="secondary">Discount:</Text>
            <Text type="danger">-${Number(order.discount).toFixed(2)}</Text>
          </Flex>
        )}
        <Flex justify="space-between" align="center">
          <Text type="secondary">Total</Text>
          <Title level={4} style={{ margin: 0, color: '#10b981' }}>
            ${Number(order.total || order.subtotal || 0).toFixed(2)}
          </Title>
        </Flex>
      </div>
    </Card>
  )
}

export default OrderCard