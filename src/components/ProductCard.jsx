import { Card, Tag, Typography, Button, Flex } from 'antd'
import { GlobalOutlined, DeleteOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

function ProductCard({ product, onEdit, onDelete }) {
  if (!product) return null

  const isActive = product.status === 'Active' || product.status === 'active'

  return (
    <Card
      hoverable
      onClick={() => onEdit && onEdit(product)}
      style={{
        borderRadius: 12,
        borderColor: '#e5e7eb',
        height: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
      styles={{
        body: {
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        },
      }}
    >
      <div>
        {/* Header: Icon, Name & Quantity */}
        <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
          <Flex align="center" gap={8}>
            <GlobalOutlined style={{ color: '#059669', fontSize: 18 }} />
            <Title level={5} style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>
              {product.name}
            </Title>
          </Flex>
          <Text strong style={{ color: '#059669', fontSize: 15 }}>
            {product.quantity}
          </Text>
        </Flex>

        {/* Details Grid */}
        <Flex vertical gap={6} style={{ marginBottom: 16 }}>
          <Flex justify="space-between">
            <Text type="secondary" style={{ fontSize: 12 }}>Category</Text>
            <Text style={{ fontSize: 12, color: '#4b5563' }}>{product.category}</Text>
          </Flex>

          <Flex justify="space-between">
            <Text type="secondary" style={{ fontSize: 12 }}>Selling Price / Cost</Text>
            <Text style={{ fontSize: 12, color: '#4b5563' }}>
              ${Number(product.sellingPrice || 0).toFixed(2)} / ${Number(product.costPrice || 0).toFixed(2)}
            </Text>
          </Flex>

          <Flex justify="space-between">
            <Text type="secondary" style={{ fontSize: 12 }}>Barcode</Text>
            <Text style={{ fontSize: 12, color: '#4b5563' }}>{product.barcode || '-'}</Text>
          </Flex>
        </Flex>
      </div>

      {/* Card Footer: Status Tag & Delete Action */}
      <Flex justify="space-between" align="center" style={{ paddingTop: 8 }}>
        <Tag
          color={isActive ? 'success' : 'default'}
          style={{
            borderRadius: 12,
            padding: '2px 10px',
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          {isActive ? 'active' : 'inactive'}
        </Tag>

        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          style={{ borderRadius: 6 }}
          onClick={(e) => {
            e.stopPropagation() // Prevent triggering card click (edit)
            onDelete && onDelete(product.id)
          }}
        />
      </Flex>
    </Card>
  )
}

export default ProductCard