

export function Categories(){
    return (
        <>
   <div className="categories-page">
      <Flex justify="space-between" align="flex-start" wrap="wrap" gap="middle" style={{ marginBottom: 24 }}>
        <div>
          <Tag color="cyan" icon={<AppstoreOutlined />} style={{ marginBottom: 8 }}>
            Reusable Component
          </Tag>
          <Title level={2} style={{ margin: '4px 0 8px 0' }}>
            Products
          </Title>
          <Paragraph type="secondary" style={{ margin: 0, maxWidth: 600 }}>
            Each card is rendered with the ProductCard component. React repeats it with distinct product props.
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
        >
          Download
        </Button>   
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/add-product')}
        >
          Add Product
        </Button>
      </Flex>

      {products.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="There are no products in the inventory yet."
          style={{ padding: '40px 0' }}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/add-product')}>
            Add First Product
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={6} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
        </>
    );
}

