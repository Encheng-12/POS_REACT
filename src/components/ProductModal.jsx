// src/components/ProductModal.jsx
import { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, Select, Row, Col, Button, Spin, App } from 'antd'
import { getCategories } from '../services/categoryapi.js'

const statuses = ['Active', 'Inactive']

function ProductModal({ open, onCancel, onSave, initialValues, loading }) {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [categories, setCategories] = useState([])
  const [fetchingCategories, setFetchingCategories] = useState(false)
  const isEditing = Boolean(initialValues)

  const fetchCategories = async () => {
    setFetchingCategories(true)
    try {
      const res = await getCategories()
      const categoryList = res.categories || res || []
      setCategories(categoryList)
      return categoryList
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      message.error('Failed to load category data.')
      return []
    } finally {
      setFetchingCategories(false)
    }
  }

  useEffect(() => {
    if (open) {
      const initModal = async () => {
        const categoryList = await fetchCategories()

        if (initialValues) {
          const defaultCid = categoryList[0] ? categoryList[0].id : undefined
          form.setFieldsValue({
            ...initialValues,
            cid: initialValues.cid ?? defaultCid,
          })
        } else {
          form.resetFields()
          if (categoryList.length > 0) {
            form.setFieldValue('cid', categoryList[0].id)
          }
        }
      }

      initModal()
    }
  }, [open, initialValues, form])

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(isEditing ? { ...initialValues, ...values } : values)
      })
      .catch((err) => {
        console.log('Validation Error:', err)
      })
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      open={open}
      title={
        <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
          {isEditing ? 'Edit product' : 'New product'}
        </span>
      }
      onCancel={handleCancel}
      footer={[
        <Button
          key="cancel"
          size="large"
          onClick={handleCancel}
          style={{ borderRadius: 8, padding: '0 20px', fontWeight: 500 }}
          disabled={loading}
        >
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          size="large"
          loading={loading}
          onClick={handleSubmit}
          style={{
            backgroundColor: '#10b981',
            borderColor: '#10b981',
            borderRadius: 8,
            padding: '0 24px',
            fontWeight: 500,
          }}
        >
          Save
        </Button>,
      ]}
      width={500}
      centered
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={{
          status: 'Active',
          costPrice: 0,
          sellingPrice: 0,
          quantity: 0,
        }}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label={<span style={{ color: '#6b7280', fontWeight: 500 }}>Product name</span>}
          name="name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input size="large" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: '#6b7280', fontWeight: 500 }}>Barcode</span>}
          name="barcode"
        >
          <Input size="large" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span style={{ color: '#6b7280', fontWeight: 500 }}>Category</span>}
              name="cid"
              rules={[{ required: true, message: 'Select category' }]}
            >
              <Select
                size="large"
                style={{ borderRadius: 8 }}
                placeholder="Select category"
                loading={fetchingCategories}
                notFoundContent={fetchingCategories ? <Spin size="small" /> : null}
              >
                {categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={<span style={{ color: '#6b7280', fontWeight: 500 }}>Status</span>}
              name="status"
              rules={[{ required: true }]}
            >
              <Select size="large" style={{ borderRadius: 8 }}>
                {statuses.map((st) => (
                  <Select.Option key={st} value={st}>
                    {st}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span style={{ color: '#6b7280', fontWeight: 500 }}>Cost price</span>}
              name="costPrice"
            >
              <InputNumber size="large" style={{ width: '100%', borderRadius: 8 }} min={0} step={0.01} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={<span style={{ color: '#6b7280', fontWeight: 500 }}>Selling price</span>}
              name="sellingPrice"
            >
              <InputNumber size="large" style={{ width: '100%', borderRadius: 8 }} min={0} step={0.01} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<span style={{ color: '#6b7280', fontWeight: 500 }}>Stock quantity</span>}
          name="quantity"
        >
          <InputNumber size="large" style={{ width: '100%', borderRadius: 8 }} min={0} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ProductModal