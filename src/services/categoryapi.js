// src/services/categoryapi.js
const apiurl = import.meta.env.VITE_API_URL
const API_URL = `${apiurl}/categories`

const mapCategoryData = (item) => ({
  id: item.id,
  name: item.name,
  description: item.description || '',
})

const preparePayload = (formValues) => ({
  name: formValues.name,
  description: formValues.description || '',
})

export const getCategories = async (page = 1) => {
  const response = await fetch(`${API_URL}?page=${page}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) throw new Error('Failed to fetch categories')
  const result = await response.json()

  return {
    categories: (result.data || []).map(mapCategoryData),
    pagination: {
      currentPage: result.current_page || 1,
      lastPage: result.last_page || 1,
      total: result.total || 0,
    },
  }
}

export const createCategory = async (categoryData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preparePayload(categoryData)),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const message =
      errorData?.message || Object.values(errorData?.errors || {})[0]?.[0] || 'Failed to create category'
    throw new Error(message)
  }

  const result = await response.json()
  return mapCategoryData(result.data || result)
}

export const updateCategory = async (id, categoryData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preparePayload(categoryData)),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const message =
      errorData?.message || Object.values(errorData?.errors || {})[0]?.[0] || 'Failed to update category'
    throw new Error(message)
  }

  const result = await response.json()
  return mapCategoryData(result.data || result)
}

export const deleteCategory = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) throw new Error('Failed to delete category')
  return true
}