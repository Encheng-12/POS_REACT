import { Card, Tag, Typography, Space, Badge } from 'antd'
import { InboxOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

function OrderCard({ Order }) {
  const noOrder = Order.total === 0

  return (
    <Card
      hoverable
      className="Order-card"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderColor: '#e5e7eb',
      }}
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          padding: '20px',
        },
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Tag color="blue" icon={<InboxOutlined />}>
            {Order.status}
          </Tag>
        </div>

        <Title level={4} style={{ margin: '8px 0 16px 0', fontSize: 18 }}>
          {Order.invoice}
        </Title>
      </div>

      <div style={{ paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
        <Space orientation="horizontal" align="center">
          {noOrder ? (
            <Tag color="error" icon={<CloseCircleOutlined />} style={{ padding: '4px 10px', fontSize: 13 }}>
              Out of stock
            </Tag>
          ) : (
            <Tag color="success" icon={<CheckCircleOutlined />} style={{ padding: '4px 10px', fontSize: 13 }}>
              <strong>{Order.total}</strong> 
            </Tag>
          )}
        </Space>
      </div>
    </Card>
  )
}

export default OrderCard
