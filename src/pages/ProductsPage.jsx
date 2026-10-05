import { useState, useEffect } from 'react'
import { Typography, Row, Col, Button, Tag, Flex, Card, Input, Spin, Pagination, App } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import ProductCard from '../components/ProductCard.jsx'
import ProductModal from '../components/ProductModal.jsx'
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productapi.js'

const { Title, Text } = Typography

function ProductsPage() {
  const { message } = App.useApp()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      console.log(data)
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

  const handleOpenNewModal = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (formValues) => {
    try {
      setSaving(true)
      if (editingProduct) {
        await updateProduct(editingProduct.id, formValues)
        message.success('Product updated successfully!')
      } else {
        await createProduct(formValues)
        message.success('Product created successfully!')
      }
      setIsModalOpen(false)
      loadProducts(currentPage)
    } catch (error) {
      message.error(error.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id)
      message.success('Product deleted successfully')
      loadProducts(currentPage)
    } catch (error) {
      message.error(error.message || 'Failed to delete product')
    }
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

      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
            Products
          </Title>
          <Text type="secondary">{totalProducts} products total</Text>
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

      <Card
        variant="borderless"
        style={{
          borderRadius: 12,
          marginBottom: 20,
          width: '100%',
          height: 'auto',
        }}
        styles={{
          body: {
            padding: '16px',
            height: 'auto',
          },
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 10px',
            alignItems: 'center',
          }}
        >
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
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            All
          </Tag>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name
            return (
              <Tag
                key={cat.id}
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
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {cat.name}
              </Tag>
            )
          })}
        </div>
      </Card>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {filteredProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <ProductCard
                product={product}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteProduct}
              />
            </Col>
          ))}
        </Row>
      </Spin>

      <Flex justify="center" style={{ marginTop: 24 }}>
        <Pagination
          current={currentPage}
          total={totalProducts}
          pageSize={12}
          onChange={(page) => setCurrentPage(page)}
        />
      </Flex>

      <ProductModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialValues={editingProduct}
        loading={saving}
      />
    </div>
  )
}

export default ProductsPage