// Remove trailing slash from VITE_API_URL if present to avoid double slashes
const BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");
const API_URL = `${BASE_URL}/payments`;

const mapPaymentData = (item) => ({
  id: item.id,
  orderId: item.order_id,
  order: item.order, // Ensure nested relation is preserved
  paymentMethod: item.payment_method,
  amount: Number(item.amount || 0),
  referenceNo: item.reference_no || "",
  paidAt: item.paid_at,
  createdAt: item.created_at,
});

export const getPayments = async (page = 1, method = "all") => {
  const url = new URL(API_URL);
  url.searchParams.append("page", page);
  url.searchParams.append("per_page", "10");
  if (method !== "all") {
    url.searchParams.append("method", method);
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Payment API error: ${response.status}`);
  }

  const result = await response.json();

  // Handles standard JSON response as well as Laravel paginated response structure (result.data.data)
  const items = Array.isArray(result.data) 
    ? result.data 
    : (result.data?.data || []);

  const meta = result.meta || result;

  return {
    payments: items.map(mapPaymentData),
    pagination: {
      currentPage: meta.current_page || page,
      lastPage: meta.last_page || 1,
      total: meta.total || items.length,
    },
  };
};