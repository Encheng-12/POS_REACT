// src/services/productapi.js
const apiurl = import.meta.env.VITE_API_URL
const API_URL = apiurl + '/products'
const CATEGORY_API_URL = apiurl + '/categories'

export const getCategories = async () => {
  const response = await fetch(CATEGORY_API_URL, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) throw new Error('Failed to fetch categories')
  const result = await response.json()
  return Array.isArray(result) ? result : result.data || []
}

const mapProductData = (item) => ({
  id: item.id,
  name: item.name,
  barcode: item.barcode || '',
  category: item.category?.name || item.categories?.name || 'Uncategorized',
  cid: item.cid || item.category_id || 1,
  costPrice: parseFloat(item.cost_price || 0),
  sellingPrice: parseFloat(item.selling_price || 0),
  quantity: item.stock_quantity || item.quantity || 0,
  status: item.status?.toLowerCase() === 'active' ? 'Active' : 'Inactive',
})

const preparePayload = (formValues) => ({
  name: formValues.name,
  barcode: formValues.barcode || '',
  category_id: Number(formValues.cid || formValues.category_id || 1),
  cost_price: Number(formValues.costPrice ?? formValues.cost_price ?? 0),
  selling_price: Number(formValues.sellingPrice ?? formValues.selling_price ?? 0),
  stock_quantity: Number(formValues.quantity ?? 0),
  status: (formValues.status || 'active').toLowerCase(),
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

  return {
    products: (result.data || []).map(mapProductData),
    pagination: {
      currentPage: result.current_page || 1,
      lastPage: result.last_page || 1,
      total: result.total || 0,
    },
  }
}

export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preparePayload(productData)),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const message =
      errorData?.message || Object.values(errorData?.errors || {})[0]?.[0] || 'Failed to create product'
    throw new Error(message)
  }

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

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const message =
      errorData?.message || Object.values(errorData?.errors || {})[0]?.[0] || 'Failed to update product'
    throw new Error(message)
  }

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