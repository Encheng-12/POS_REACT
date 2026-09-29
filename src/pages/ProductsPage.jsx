import { useState } from 'react'
import { Typography, Row, Col, Button, Tag, Flex, Card, Input, Modal, App } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import ProductCard from '../components/ProductCard.jsx'
import ProductForm from '../components/ProductForm.jsx'

const { Title, Text } = Typography

const initialProducts = [
  { id: 1, name: 'Sparkling Water 500ml', barcode: '8801234000011', category: 'Beverages', status: 'Active', costPrice: 0.35, sellingPrice: 0.75, quantity: 142 },
  { id: 2, name: 'Orange Juice 1L', barcode: '8801234000028', category: 'Beverages', status: 'Active', costPrice: 1.10, sellingPrice: 2.20, quantity: 58 },
  { id: 3, name: 'Potato Chips 150g', barcode: '8801234000042', category: 'Snacks', status: 'Active', costPrice: 0.60, sellingPrice: 1.25, quantity: 210 },
  { id: 4, name: 'Chocolate Cookies', barcode: '8801234000059', category: 'Snacks', status: 'Inactive', costPrice: 0.80, sellingPrice: 1.60, quantity: 0 },
  { id: 5, name: 'Mixed Nuts 200g', barcode: '8801234000066', category: 'Snacks', status: 'Active', costPrice: 1.50, sellingPrice: 2.95, quantity: 34 },
  { id: 6, name: 'Croissant', barcode: '8801234000073', category: 'Bakery', status: 'Active', costPrice: 0.45, sellingPrice: 1.10, quantity: 22 },
  { id: 7, name: 'Sourdough Loaf', barcode: '8801234000080', category: 'Bakery', status: 'Active', costPrice: 1.10, sellingPrice: 2.50, quantity: 15 },
]

function ProductsPage() {
  const { message } = App.useApp()
  const [products, setProducts] = useState(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal Pop Up States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const categories = ['All', 'Beverages', 'Snacks', 'Bakery', 'Dairy']

  // Open Pop Up for New Product
  const handleOpenNewModal = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  // Open Pop Up for Edit Product
  const handleOpenEditModal = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // Save changes to products state
  const handleSaveProduct = (formValues) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) => (item.id === editingProduct.id ? { ...item, ...formValues } : item))
      )
      message.success('Product updated successfully!')
    } else {
      const newProduct = {
        id: Date.now(),
        ...formValues,
        costPrice: formValues.costPrice || 0,
        sellingPrice: formValues.sellingPrice || 0,
        quantity: formValues.quantity || 0,
      }
      setProducts((prev) => [newProduct, ...prev])
      message.success('Product added successfully!')
    }
    setIsModalOpen(false)
  }

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id))
    message.success('Product deleted')
  }

  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.barcode && item.barcode.includes(searchQuery))
    return matchesCategory && matchesSearch
  })

  return (
    <div style={{ padding: '24px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      {/* Search Bar */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Input
          placeholder="Search products or barcode"
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 360, borderRadius: 8 }}
          size="large"
        />
      </Flex>

      {/* Header */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
            Products
          </Title>
          <Text type="secondary">
            {products.length} products in {categories.length - 1} categories
          </Text>
        </div>

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
          onClick={handleOpenNewModal}
        >
          New product
        </Button>
      </Flex>

      {/* Category Pills */}
      <Card
        variant="borderless"
        style={{ borderRadius: 12, marginBottom: 20 }}
        styles={{ body: { padding: '12px 16px' } }}
      >
        <Flex gap="small">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <Tag
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 16,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  backgroundColor: isSelected ? '#10b981' : '#f3f4f6',
                  color: isSelected ? '#ffffff' : '#4b5563',
                  border: 'none',
                }}
              >
                {cat}
              </Tag>
            )
          })}
        </Flex>
      </Card>

      {/* Cards Grid */}
      <Row gutter={[16, 16]}>
        {filteredProducts.map((product) => (
          <Col xs={24} sm={12} md={8} lg={4} key={product.id}>
            <ProductCard
              product={product}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProduct}
            />
          </Col>
        ))}
      </Row>

      {/* Pop Up Modal wrapping ProductForm */}
      <Modal
        open={isModalOpen}
        title={
          <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
            {editingProduct ? 'Edit product' : 'New product'}
          </span>
        }
        onCancel={handleCloseModal}
        footer={null}
        width={500}
        centered
        destroyOnHidden
      >
        <ProductForm
          initialValues={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}

export default ProductsPage