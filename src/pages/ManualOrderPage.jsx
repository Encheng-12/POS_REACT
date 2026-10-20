import { useState, useEffect } from 'react'
import {
  Typography,
  Row,
  Col,
  Button,
  Tag,
  Flex,
  Card,
  Input,
  Spin,
  Pagination,
  App,
  InputNumber,
  Divider,
  Modal,
  Radio,
  Empty,
} from 'antd'
import {
  SearchOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import ManualOrderCard from '../components/ManualOrderCard.jsx'
import { getProducts, getCategories } from '../services/productapi.js'

const { Title, Text } = Typography

function ManualOrderPage() {
  const { message } = App.useApp()

  // Product & Category State
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Cart & Order State
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState('Walk-in')
  const [discount, setDiscount] = useState(0)
  const [taxRate] = useState(0.08) // 8% standard tax
  const [paymentMethod, setPaymentMethod] = useState('cash')

  // Checkout & History Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [completedOrders, setCompletedOrders] = useState([])
  const [processingPayment, setProcessingPayment] = useState(false)

  // Load Categories & Products
  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadProducts = async (page = 1) => {
    try {
      setLoading(true)
      const { products, pagination } = await getProducts(page)
      setProducts(products)
      setTotalProducts(pagination.total)
      setCurrentPage(pagination.currentPage)
    } catch (error) {
      message.error(error.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts(currentPage)
  }, [currentPage])

  // Cart Management Functions
  const handleAddToCart = (product) => {
    const unitPrice = Number(product.sellingPrice || product.price || 0)

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: unitPrice,
          category: product.category,
          quantity: 1,
          product,
        },
      ]
    })
  }

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    )
  }

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const handleClearCart = () => {
    setCart([])
  }

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const taxAmount = subtotal * taxRate
  const totalAmount = Math.max(0, subtotal + taxAmount - Number(discount || 0))

  // Complete Order / Payment Submission
  const handleCompleteOrder = () => {
    if (cart.length === 0) return

    setProcessingPayment(true)
    setTimeout(() => {
      const newOrder = {
        id: Date.now(),
        invoiceNo: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
        customer: customerName || 'Walk-in',
        cashierName: 'Cashier #1',
        status: 'Completed',
        items: cart.map((item) => ({
          id: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        discount: Number(discount),
        subtotal,
        total: totalAmount,
        createdAt: new Date().toISOString(),
      }

      setCompletedOrders([newOrder, ...completedOrders])
      message.success(`Order ${newOrder.invoiceNo} completed successfully!`)
      setCart([])
      setDiscount(0)
      setCustomerName('Walk-in')
      setProcessingPayment(false)
      setIsCheckoutOpen(false)
    }, 800)
  }

  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.barcode && item.barcode.includes(searchQuery))
    return matchesCategory && matchesSearch
  })

  return (
    <div style={{ padding: '24px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      {/* Top Header */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
            Cashier POS
          </Title>
          <Text type="secondary">{totalProducts} available products</Text>
        </div>

        <Flex gap="middle">
          <Button
            icon={<HistoryOutlined />}
            size="large"
            onClick={() => setIsHistoryOpen(true)}
          >
            Order History ({completedOrders.length})
          </Button>
        </Flex>
      </Flex>

      <Row gutter={24}>
        {/* Left Section: Product Grid */}
        <Col xs={24} lg={15} xl={16}>
          {/* Search & Category Filter */}
          <Card
            variant="borderless"
            style={{ borderRadius: 12, marginBottom: 20 }}
            styles={{ body: { padding: '16px' } }}
          >
            <Input
              placeholder="Search products by name or barcode..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: 8, marginBottom: 16 }}
              size="large"
              allowClear
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 10px' }}>
              <Tag
                key="All"
                onClick={() => setSelectedCategory('All')}
                style={{
                  padding: '6px 16px',
                  borderRadius: 16,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  backgroundColor: selectedCategory === 'All' ? '#10b981' : '#f3f4f6',
                  color: selectedCategory === 'All' ? '#ffffff' : '#4b5563',
                  border: 'none',
                  margin: 0,
                }}
              >
                All
              </Tag>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name
                return (
                  <Tag
                    key={cat.id || cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 16,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                      backgroundColor: isSelected ? '#10b981' : '#f3f4f6',
                      color: isSelected ? '#ffffff' : '#4b5563',
                      border: 'none',
                      margin: 0,
                    }}
                  >
                    {cat.name}
                  </Tag>
                )
              })}
            </div>
          </Card>

          {/* Product Grid (With controls) */}
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              {filteredProducts.map((product) => {
                const cartItem = cart.find((item) => item.id === product.id)
                const itemData = {
                  id: product.id,
                  name: product.name,
                  price: product.sellingPrice,
                  category: product.category,
                  quantity: cartItem ? cartItem.quantity : 0,
                  product,
                }

                return (
                  <Col xs={24} sm={12} md={8} lg={8} key={product.id}>
                    <ManualOrderCard
                      item={itemData}
                      onIncrease={() => handleAddToCart(product)}
                      onDecrease={() =>
                        cartItem && handleUpdateQuantity(product.id, cartItem.quantity - 1)
                      }
                      onRemove={() => handleRemoveFromCart(product.id)}
                    />
                  </Col>
                )
              })}
            </Row>
          </Spin>

          {/* Pagination */}
          <Flex justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
            <Pagination
              current={currentPage}
              total={totalProducts}
              pageSize={12}
              onChange={(page) => setCurrentPage(page)}
            />
          </Flex>
        </Col>

        {/* Right Section: Current Order Panel */}
        <Col xs={24} lg={9} xl={8}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 12,
              position: 'sticky',
              top: 24,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>
                <ShoppingCartOutlined /> Current Order
              </Title>
              {cart.length > 0 && (
                <Button type="text" danger onClick={handleClearCart}>
                  Clear All
                </Button>
              )}
            </Flex>

            {/* Customer Name Input */}
            <Input
              placeholder="Customer Name (e.g. Walk-in)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ marginBottom: 16, borderRadius: 6 }}
            />

            <Divider style={{ margin: '12px 0' }} />

            {/* Cart Items List using ManualOrderCard without +, -, or bin icons */}
            <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: 4 }}>
              {cart.length === 0 ? (
                <Empty description="No products selected" style={{ margin: '40px 0' }} />
              ) : (
                cart.map((item) => (
                  <ManualOrderCard
                    key={item.id}
                    item={item}
                    hideControls={true}
                  />
                ))
              )}
            </div>

            <Divider style={{ margin: '12px 0' }} />

            {/* Order Totals Summary */}
            <Flex vertical gap="xs">
              <Flex justify="space-between">
                <Text type="secondary">Subtotal</Text>
                <Text>${subtotal.toFixed(2)}</Text>
              </Flex>

              <Flex justify="space-between" align="center">
                <Text type="secondary">Discount ($)</Text>
                <InputNumber
                  min={0}
                  max={subtotal}
                  value={discount}
                  onChange={(val) => setDiscount(val || 0)}
                  style={{ width: 90 }}
                  size="small"
                />
              </Flex>

              <Flex justify="space-between">
                <Text type="secondary">Tax (8%)</Text>
                <Text>${taxAmount.toFixed(2)}</Text>
              </Flex>

              <Divider style={{ margin: '8px 0' }} />

              <Flex justify="space-between" align="center">
                <Title level={4} style={{ margin: 0 }}>
                  Total
                </Title>
                <Title level={3} style={{ margin: 0, color: '#10b981' }}>
                  ${totalAmount.toFixed(2)}
                </Title>
              </Flex>

              <Button
                type="primary"
                size="large"
                block
                disabled={cart.length === 0}
                style={{
                  marginTop: 16,
                  backgroundColor: '#10b981',
                  borderColor: '#10b981',
                  height: 48,
                  fontWeight: 600,
                }}
                onClick={() => setIsCheckoutOpen(true)}
              >
                Checkout (${totalAmount.toFixed(2)})
              </Button>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Checkout Modal */}
      <Modal
        title="Process Checkout"
        open={isCheckoutOpen}
        onCancel={() => setIsCheckoutOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Flex vertical gap="middle" style={{ marginTop: 16 }}>
          <div>
            <Text type="secondary">Customer:</Text>
            <Title level={5} style={{ margin: 0 }}>
              {customerName || 'Walk-in'}
            </Title>
          </div>

          <div>
            <Text type="secondary">Payment Method:</Text>
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ display: 'flex', gap: 12, marginTop: 8 }}
            >
              <Radio.Button value="cash" style={{ flex: 1, textAlign: 'center' }}>
                Cash
              </Radio.Button>
              <Radio.Button value="card" style={{ flex: 1, textAlign: 'center' }}>
                Credit Card
              </Radio.Button>
            </Radio.Group>
          </div>

          <Card style={{ backgroundColor: '#f9fafb' }}>
            <Flex justify="space-between" style={{ marginBottom: 4 }}>
              <Text>Items ({cart.reduce((acc, i) => acc + i.quantity, 0)} total):</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </Flex>
            {discount > 0 && (
              <Flex justify="space-between" style={{ marginBottom: 4 }}>
                <Text type="danger">Discount:</Text>
                <Text type="danger">-${Number(discount).toFixed(2)}</Text>
              </Flex>
            )}
            <Flex justify="space-between" style={{ marginBottom: 4 }}>
              <Text>Tax (8%):</Text>
              <Text>${taxAmount.toFixed(2)}</Text>
            </Flex>
            <Divider style={{ margin: '8px 0' }} />
            <Flex justify="space-between" align="center">
              <Text strong>Total Payable:</Text>
              <Title level={3} style={{ margin: 0, color: '#10b981' }}>
                ${totalAmount.toFixed(2)}
              </Title>
            </Flex>
          </Card>

          <Button
            type="primary"
            size="large"
            block
            loading={processingPayment}
            icon={<CheckCircleOutlined />}
            style={{
              backgroundColor: '#10b981',
              borderColor: '#10b981',
              height: 48,
              fontWeight: 600,
            }}
            onClick={handleCompleteOrder}
          >
            Confirm & Complete Order
          </Button>
        </Flex>
      </Modal>

      {/* Completed Orders History Modal */}
      <Modal
        title="Recent Orders"
        open={isHistoryOpen}
        onCancel={() => setIsHistoryOpen(false)}
        footer={null}
        width={800}
      >
        {completedOrders.length === 0 ? (
          <Empty description="No completed orders yet" />
        ) : (
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {completedOrders.map((ord) => (
              <Col xs={24} sm={12} key={ord.id}>
                <Card size="small" style={{ borderRadius: 8 }}>
                  <Flex justify="space-between">
                    <Text strong>{ord.invoiceNo}</Text>
                    <Text type="success">${ord.total.toFixed(2)}</Text>
                  </Flex>
                  <Text type="secondary">Customer: {ord.customer}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Modal>
    </div>
  )
}

export default ManualOrderPage