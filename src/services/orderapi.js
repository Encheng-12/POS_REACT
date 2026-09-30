// src/services/orderapi.js
const apiurl = import.meta.env.VITE_API_URL
const API_URL = apiurl + "/orders";

// Helper function to map Laravel order JSON format to React UI format
const mapOrderData = (item) => ({
  id: item.id,
  invoiceNo: item.invoice_no,
  cashierId: item.cashier_id,
  customerId: item.customer_id,
  subtotal: Number(item.subtotal || 0),
  tax: Number(item.tax || 0),
  discount: Number(item.discount || 0),
  total: Number(item.subtotal || 0) + Number(item.tax || 0) - Number(item.discount || 0),
  status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() : "Pending",
  createdAt: item.created_at,
  updatedAt: item.updated_at,
  customer: item.customer
    ? {
        id: item.customer.id,
        name: item.customer.name,
        email: item.customer.email,
        phoneNumber: item.customer.phone_number || "",
        role: item.customer.role,
        status: item.customer.status,
      }
    : null,
});

// Helper function to prepare payload for POST / PUT
const preparePayload = (formValues) => ({
  cashier_id: formValues.cashierId,
  customer_id: formValues.customerId,
  invoice_no: formValues.invoiceNo,
  subtotal: formValues.subtotal,
  tax: formValues.tax || 0,
  discount: formValues.discount || 0,
  status: formValues.status?.toLowerCase() || "pending",
});

export const getOrders = async ({ page = 1, perPage = 10, search = "", status = "All" } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (status && status !== "All") {
    params.append("status", status.toLowerCase());
  }

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const result = await response.json();

  return {
    orders: (result.data || []).map(mapOrderData),
    pagination: {
      currentPage: result.current_page || page,
      lastPage: result.last_page || 1,
      pageSize: result.per_page || perPage,
      total: result.total || 0,
    },
  };
};

export const createOrder = async (orderData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preparePayload(orderData)),
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  const result = await response.json();
  return mapOrderData(result.data || result);
};

export const updateOrder = async (id, orderData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preparePayload(orderData)),
  });

  if (!response.ok) {
    throw new Error("Failed to update order");
  }

  const result = await response.json();
  return mapOrderData(result.data || result);
};

export const deleteOrder = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete order");
  }

  return true;
};