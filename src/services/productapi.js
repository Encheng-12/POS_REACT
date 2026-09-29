// src/services/productService.js
const API_URL = 'http://127.0.0.1:8000/api/products'

// Helper function to map Laravel backend JSON format to React UI format
const mapProductData = (item) => ({
  id: item.id,
  name: item.name,
  barcode: item.barcode || '',
  category: item.categories ? item.categories.name : 'Uncategorized',
  cid: item.cid,
  costPrice: parseFloat(item.cost_price || 0),
  sellingPrice: parseFloat(item.selling_price || 0),
  quantity: item.stock_quantity || 0,
  status: item.status === 'active' ? 'Active' : 'Inactive',
})

// Helper function to prepare payload for POST / PUT
const preparePayload = (formValues) => ({
  name: formValues.name,
  barcode: formValues.barcode,
  cid: formValues.cid || 1, // Category ID required by database
  cost_price: formValues.costPrice,
  selling_price: formValues.sellingPrice,
  stock_quantity: formValues.quantity,
  status: formValues.status?.toLowerCase() || 'active',
})

export const getProducts = async (page = 1) => {
  const response = await fetch(`${API_URL}?page=${page}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) throw new Error('Failed to fetch products')
  const result = await response.json()
  
  // Extract list array from pagination result (`result.data`)
  return {
    products: (result.data || []).map(mapProductData),
    pagination: {
      currentPage: result.current_page,
      lastPage: result.last_page,
      total: result.total,
    },
  }
}

export const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preparePayload(productData)),
  })

  if (!response.ok) throw new Error('Failed to create product')
  const result = await response.json()
  return mapProductData(result.data || result)
}

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preparePayload(productData)),
  })

  if (!response.ok) throw new Error('Failed to update product')
  const result = await response.json()
  return mapProductData(result.data || result)
}

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) throw new Error('Failed to delete product')
  return true
}