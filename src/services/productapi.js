const API_URL = 'https://your-api-endpoint.com/api/products' // Replace with your real backend endpoint

export const getProducts = async () => {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  })
  if (!response.ok) throw new Error('Failed to create product')
  return response.json()
}

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  })
  if (!response.ok) throw new Error('Failed to update product')
  return response.json()
}

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete product')
  return response.json()
}