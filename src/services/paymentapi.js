// const API_URL = "http://127.0.0.1:8000/api/payments";
// const apiurl = import.meta.env.VITE_API_URL;
// const API_URL = apiurl + "/payments";
const API_URL = `${import.meta.env.VITE_API_URL}/payments`;

const mapPaymentData = (item) => ({
  id: item.id,
  orderId: item.order_id,
  order: item.order || null,
  paymentMethod: item.payment_method,
  amount: Number(item.amount || 0),
  referenceNo: item.reference_no || "",
  paidAt: item.paid_at,
  createdAt: item.created_at,
});

export const getPayments = async (page = 1, method = "all") => {
  const response = await fetch(
    `${API_URL}?page=${page}&per_page=10&method=${method}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }

  const result = await response.json();

  return {
    payments: (result.data || []).map(mapPaymentData),

    pagination: {
      currentPage: result.current_page,
      lastPage: result.last_page,
      total: result.total,
    },
  };
};
