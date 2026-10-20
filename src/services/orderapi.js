const API_BASE = import.meta.env.VITE_API_URL
const ORDERS_URL = `${API_BASE}/orders`
const PRODUCTS_URL = `${API_BASE}/products`
const ORDER_PRODUCTS_URL = `${API_BASE}/orderproduct`
const USERS_URL = `${API_BASE}/users`

// Helper to prepare common request headers
const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Helper to calculate summary amounts dynamically from line items
export const calculateOrderTotals = (items = [], taxRate = 0) => {
  const { subtotal, discount } = items.reduce(
    (acc, item) => {
      const itemSubtotal = Number(item.quantity || item.qty || 0) * Number(item.unitPrice || item.unit_price || 0)
      const itemDiscount = Number(item.discount || 0)
      
      acc.subtotal += itemSubtotal
      acc.discount += itemDiscount
      return acc
    },
    { subtotal: 0, discount: 0 }
  )

  const tax = Number(taxRate || 0)
  const total = subtotal - discount + tax

  return {
    subtotal,
    discount,
    tax,
    total: Math.max(0, total), // Ensure total doesn't go below zero
  }
}

// ==========================================
// USER API HANDLERS
// ==========================================

export const getUserById = async (userId) => {
  if (!userId) return null
  try {
    const response = await fetch(`${USERS_URL}/${userId}`, {
      headers: getHeaders(),
    })
    if (!response.ok) return null
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error)
    return null
  }
}

// ==========================================
// ORDER-PRODUCT (PIVOT) MAPPERS & HANDLERS
// ==========================================

export const mapOrderProductItem = (item) => ({
  id: item.id,
  orderId: item.order_id,
  productId: item.product_id,
  productName: item.products?.name || item.product?.name || `Product #${item.product_id}`,
  quantity: Number(item.quantity || 1),
  unitPrice: Number(item.unit_price || 0),
  discount: Number(item.discount || 0),
  amount: Number(item.amount || item.subtotal || 0),
  createdAt: item.created_at,
  updatedAt: item.updated_at,
})

export const getOrderProducts = async ({ page = 1, perPage = 100, orderId = null } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  })

  // Append order_id query param so Laravel filters by this specific order
  if (orderId) {
    params.append('order_id', orderId.toString())
  }

  const response = await fetch(`${ORDER_PRODUCTS_URL}?${params.toString()}`, {
    headers: getHeaders(),
  })

  if (!response.ok) throw new Error('Failed to fetch order-product relations')

  const result = await response.json()

  // Filter client-side as a backup safeguard if backend returns all items
  const rawItems = result.data || []
  const filteredItems = orderId
    ? rawItems.filter((item) => Number(item.order_id) === Number(orderId))
    : rawItems

  return {
    orderProducts: filteredItems.map(mapOrderProductItem),
    pagination: {
      currentPage: result.current_page || page,
      lastPage: result.last_page || 1,
      pageSize: result.per_page || perPage,
      total: result.total || 0,
    },
  }
}

// ==========================================
// ORDER API HANDLERS
// ==========================================

export const mapOrderData = (item) => {
  const subtotal = Number(item.subtotal || 0)
  const tax = Number(item.tax || 0)
  const discount = Number(item.discount || 0)
  const calculatedTotal = item.total !== undefined ? Number(item.total) : subtotal + tax - discount

  return {
    id: item.id,
    invoiceNo: item.invoice_no || item.invoice || `INV-${item.id}`,
    cashierId: item.cashier_id,
    customerId: item.customer_id,
    cashierName: item.cashier?.name || item.cashier_name || null,
    customerName: item.customer?.name || item.customer_name || null,
    subtotal,
    tax,
    discount,
    total: calculatedTotal,
    status: item.status
      ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()
      : 'Pending',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    items: Array.isArray(item.items)
      ? item.items.map(mapOrderProductItem)
      : Array.isArray(item.order_products)
      ? item.order_products.map(mapOrderProductItem)
      : [],
    customer: item.customer
      ? {
          id: item.customer.id,
          name: item.customer.name,
          email: item.customer.email,
          phoneNumber: item.customer.phone_number || '',
        }
      : null,
    payment: item.payment || {
      method: item.payment_method || 'Cash',
      referenceNo: item.payment_reference || '-',
      paidAt: item.paid_at || item.created_at || '-',
    },
  }
}

export const getOrders = async ({ page = 1, perPage = 10, search = '', status = 'All' } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  })

  if (search.trim()) params.append('search', search.trim())
  if (status && status !== 'All') params.append('status', status.toLowerCase())

  const response = await fetch(`${ORDERS_URL}?${params.toString()}`, {
    headers: getHeaders(),
  })

  if (!response.ok) throw new Error('Failed to fetch orders')

  const result = await response.json()

  return {
    orders: (result.data || []).map(mapOrderData),
    pagination: {
      currentPage: result.current_page || page,
      lastPage: result.last_page || 1,
      pageSize: result.per_page || perPage,
      total: result.total || 0,
    },
  }
}