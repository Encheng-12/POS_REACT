import { useNavigate } from 'react-router'
import { Typography, Row, Col, Empty, Button, Tag, Flex } from 'antd'
import { PlusOutlined, AppstoreOutlined } from '@ant-design/icons'
import { DownloadOutlined } from '@ant-design/icons';
import OrderCard from '../components/OrderCard.jsx'

const { Title, Paragraph } = Typography

function OrdersPage({ orders }) {
  const navigate = useNavigate()

  return (
    <div className="order-page">
      <Flex justify="space-between" align="flex-start" wrap="wrap" gap="middle" style={{ marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: '4px 0 8px 0' }}>
            Orders
          </Title>
        </div>
      </Flex>

      {orders.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="There are no orders in the inventory yet."
          style={{ padding: '40px 0' }}
        >

        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {orders.map((order) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={6} key={order.id}>
              <OrderCard order={order} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default OrdersPage
