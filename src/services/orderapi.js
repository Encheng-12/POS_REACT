const API_BASE = import.meta.env.VITE_API_URL
const ORDERS_URL = `${API_BASE}/orders`
const USERS_URL = `${API_BASE}/users`

// Helper to fetch user details by ID if missing from order payload
export const getUserById = async (userId) => {
  if (!userId) return null
  try {
    const response = await fetch(`${USERS_URL}/${userId}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) return null
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error)
    return null
  }
}

// Helper to map order items to clean UI standard
const mapOrderItem = (item) => ({
  id: item.id,
  product: item.product_name || item.product?.name || item.product || 'Item',
  qty: item.quantity || item.qty || 1,
  unitPrice: Number(item.unit_price || item.unitPrice || 0),
  discount: Number(item.discount || 0),
  subtotal: Number(item.subtotal || 0),
})

// Helper function to map Laravel order JSON format to React UI format
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
    items: Array.isArray(item.items) ? item.items.map(mapOrderItem) : [],
    customer: item.customer
      ? {
          id: item.customer.id,
          name: item.customer.name,
          email: item.customer.email,
          phoneNumber: item.customer.phone_number || '',
          role: item.customer.role,
          status: item.customer.status,
        }
      : null,
    payment: item.payment || {
      method: item.payment_method || 'Cash',
      referenceNo: item.payment_reference || '-',
      paidAt: item.paid_at || item.created_at || '-',
    },
  }
}

// Helper function to prepare payload for POST / PUT
const preparePayload = (formValues) => ({
  cashier_id: formValues.cashierId,
  customer_id: formValues.customerId,
  invoice_no: formValues.invoiceNo,
  subtotal: formValues.subtotal,
  tax: formValues.tax || 0,
  discount: formValues.discount || 0,
  status: formValues.status?.toLowerCase() || 'pending',
})

export const getOrders = async ({ page = 1, perPage = 10, search = '', status = 'All' } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  })

  if (search.trim()) {
    params.append('search', search.trim())
  }

  if (status && status !== 'All') {
    params.append('status', status.toLowerCase())
  }

  const response = await fetch(`${ORDERS_URL}?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch orders')
  }

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

export const createOrder = async (orderData) => {
  const response = await fetch(ORDERS_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preparePayload(orderData)),
  })

  if (!response.ok) {
    throw new Error('Failed to create order')
  }

  const result = await response.json()
  return mapOrderData(result.data || result)
}

export const updateOrder = async (id, orderData) => {
  const response = await fetch(`${ORDERS_URL}/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preparePayload(orderData)),
  })

  if (!response.ok) {
    throw new Error('Failed to update order')
  }

  const result = await response.json()
  return mapOrderData(result.data || result)
}

export const deleteOrder = async (id) => {
  const response = await fetch(`${ORDERS_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete order')
  }

  return true
}