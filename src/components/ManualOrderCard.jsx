import { Card, Typography, Button, Flex } from 'antd'
import { GlobalOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

function ManualOrderCard({ item, onIncrease, onDecrease, onRemove, hideControls = false }) {
  if (!item) return null

  const unitPrice = Number(item.price || item.sellingPrice || 0)
  const quantity = Number(item.quantity || 0)

  return (
    <Card
      hoverable
      style={{
        borderRadius: 12,
        borderColor: '#e5e7eb',
        marginBottom: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
      styles={{
        body: {
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <div>
        {/* Header: Icon & Name */}
        <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
          <Flex align="center" gap={8} style={{ overflow: 'hidden' }}>
            <GlobalOutlined style={{ color: '#059669', fontSize: 18, flexShrink: 0 }} />
            <Title
              level={5}
              ellipsis={{ tooltip: item.name }}
              style={{ margin: 0, fontWeight: 700, fontSize: 15 }}
            >
              {item.name}
            </Title>
          </Flex>
        </Flex>

        {/* Details Grid */}
        <Flex vertical gap={6} style={{ marginBottom: hideControls ? 0 : 16 }}>
          <Flex justify="space-between">
            <Text type="secondary" style={{ fontSize: 12 }}>
              Unit Price
            </Text>
            <Text style={{ fontSize: 12, color: '#4b5563' }}>
              ${unitPrice.toFixed(2)}
            </Text>
          </Flex>

          <Flex justify="space-between">
            <Text type="secondary" style={{ fontSize: 12 }}>
              Quantity
            </Text>
            <Text style={{ fontSize: 12, color: '#4b5563' }}>
              {quantity} units
            </Text>
          </Flex>

          {(item.product?.category || item.category) && (
            <Flex justify="space-between">
              <Text type="secondary" style={{ fontSize: 12 }}>
                Category
              </Text>
              <Text style={{ fontSize: 12, color: '#4b5563' }}>
                {item.product?.category || item.category}
              </Text>
            </Flex>
          )}
        </Flex>
      </div>

      {/* Centered Footer Controls */}
      {!hideControls && (
        <Flex
          justify="center"
          align="center"
          style={{ paddingTop: 10, borderTop: '1px solid #f3f4f6' }}
        >
          <Flex align="center" gap={12}>
            <Button
              size="small"
              shape="circle"
              icon={<MinusOutlined />}
              style={{ borderRadius: '50%' }}
              onClick={(e) => {
                e.stopPropagation()
                onDecrease && onDecrease(item)
              }}
            />
            <Text strong style={{ minWidth: 24, textAlign: 'center', fontSize: 14 }}>
              {quantity}
            </Text>
            <Button
              size="small"
              shape="circle"
              icon={<PlusOutlined />}
              style={{ borderRadius: '50%' }}
              onClick={(e) => {
                e.stopPropagation()
                onIncrease && onIncrease(item)
              }}
            />
          </Flex>
        </Flex>
      )}
    </Card>
  )
}

export default ManualOrderCard