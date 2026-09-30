import { useState, useEffect } from "react";
import { createStockMovement } from "../services/stockmovementapi.js";
import { getProducts } from "../services/productapi.js";

function NewStockMovementModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    product_id: "",
    type: "in",
    quantity: 1,
    reference: "",
    notes: "",
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await getProducts(1);
        setProducts(result.products);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };

    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.product_id) {
        alert("Please select a product");
        return;
      }

      const data = {
        ...formData,
        product_id: Number(formData.product_id),
        quantity: Number(formData.quantity),
      };

      console.log("Sending data:", data);

      await createStockMovement(data);

      console.log("Stock movement created successfully");

      onCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create stock movement:", error);
      alert("Failed to create stock movement. Check the console.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">
            New stock movement
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            {/* Product */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Product
              </label>

              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              >
                <option value="">Select product</option>

                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type + Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                >
                  <option value="in">In</option>
                  <option value="out">Out</option>
                  <option value="adjustment">Adjustment</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* Reference */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Reference
              </label>

              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="PO number, invoice..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            {/* Note */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Note
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-green-500 px-5 py-2.5 font-medium text-white hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewStockMovementModal;
