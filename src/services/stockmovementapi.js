// const API_URL = "http://127.0.0.1:8000/api/stock-movements";
// const apiurl = import.meta.env.VITE_API_URL;
// const API_URL = apiurl + "/stock-movements";
const API_URL = `${import.meta.env.VITE_API_URL}/stock-movements`;

const mapStockMovementData = (item) => ({
  id: item.id,
  productId: item.product_id,
  productName: item.product?.name || "Unknown Product",
  type: item.type,
  quantity: item.quantity,
  reference: item.reference,
  notes: item.notes || "",
  date: item.created_at,
});

export const getStockMovements = async (page = 1, type = "all") => {
  const response = await fetch(
    `${API_URL}?page=${page}&per_page=10&type=${type}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stock movements");
  }

  const result = await response.json();

  return {
    stockMovements: (result.data || []).map(mapStockMovementData),

    pagination: {
      currentPage: result.current_page,
      lastPage: result.last_page,
      total: result.total,
    },
  };
};

export const createStockMovement = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Laravel error:", result);
    throw new Error(result.message || "Failed to create stock movement");
  }

  return mapStockMovementData(result);
};
