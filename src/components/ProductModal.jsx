import { useEffect } from 'react'
import { Modal, Form, Input, InputNumber, Select, Row, Col, Button } from 'antd'

const categories = ['Beverages', 'Snacks', 'Bakery', 'Dairy']
const statuses = ['Active', 'Inactive']

function ProductModal({ open, onCancel, onSave, initialValues }) {
  const [form] = Form.useForm()
  const isEditing = Boolean(initialValues)

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues)
      } else {
        // Reset to clean empty defaults for "New product"
        form.resetFields()
      }
    }
  }, [open, initialValues, form])

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSave({ ...initialValues, ...values })
        form.resetFields()
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
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
        >
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          size="large"
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
          category: 'Beverages',
          status: 'Active',
        }}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label={<span style={{ color: '#6b7280', fontWeight: 500 }}>Product name</span>}
          name="name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input size="large" style={{ borderRadius: 8 }} placeholder="" />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: '#6b7280', fontWeight: 500 }}>Barcode</span>}
          name="barcode"
        >
          <Input size="large" style={{ borderRadius: 8 }} placeholder="" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span style={{ color: '#6b7280', fontWeight: 500 }}>Category</span>}
              name="category"
              rules={[{ required: true }]}
            >
              <Select size="large" style={{ borderRadius: 8 }}>
                {categories.map((cat) => (
                  <Select.Option key={cat} value={cat}>
                    {cat}
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