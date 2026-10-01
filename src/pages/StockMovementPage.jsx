import { useEffect, useState } from "react";
import Filters from "../components/Filters.jsx";
import NewStockMovementModal from "../components/NewStockMovementModal.jsx";
import { getStockMovements } from "../services/stockmovementapi.js";
import { PlusOutlined } from "@ant-design/icons";

function StockMovementPage() {
  const [showModal, setShowModal] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");

  const [stockMovements, setStockMovements] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const loadStockMovements = async () => {
    try {
      setLoading(true);

      const result = await getStockMovements(currentPage, activeFilter);

      setStockMovements(result.stockMovements);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error loading stock movements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStockMovements();
  }, [activeFilter, currentPage]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div className="rounded-xl bg-white p-7">
      {/* =========================
          Header
      ========================= */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stocks</h1>

          <p className="mt-1 text-sm text-gray-500">
            Inventory movements: restocks, sales & adjustments
          </p>
        </div>

        <button
          className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
          onClick={() => setShowModal(true)}
        >
          + New movement
        </button>
      </div>

      {/* =========================
          Filters
      ========================= */}
      <div className="mb-6">
        <Filters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* =========================
          Table
      ========================= */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-500">
            Loading...
          </div>
        ) : stockMovements.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            No stock movements found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50 text-left">
                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Product
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Type
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Quantity
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Reference
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Notes
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {stockMovements.map((movement) => (
                  <tr
                    key={movement.id}
                    className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                  >
                    {/* Product */}
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {movement.productName}
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
                          movement.type === "in"
                            ? "bg-emerald-100 text-emerald-700"
                            : movement.type === "out"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {movement.type}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4 text-gray-900">
                      {movement.quantity}
                    </td>

                    {/* Reference */}
                    <td className="px-6 py-4 text-gray-900">
                      {movement.reference}
                    </td>

                    {/* Notes */}
                    <td className="px-6 py-4 text-gray-600">
                      {movement.notes || "-"}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-600">
                      {movement.date
                        ? new Date(movement.date).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* =========================
                Pagination
            ========================= */}
            {pagination.lastPage > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                <p className="text-sm text-gray-500">
                  Page {pagination.currentPage} of {pagination.lastPage}
                </p>

                <div className="flex gap-2">
                  {Array.from(
                    { length: pagination.lastPage },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-lg px-3 py-2 text-sm ${
                        currentPage === page
                          ? "bg-emerald-500 text-white"
                          : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================
          New Stock Movement Modal
      ========================= */}
      {showModal && (
        <NewStockMovementModal
          onClose={() => setShowModal(false)}
          onCreated={loadStockMovements}
        />
      )}
    </div>
  );
}

export default StockMovementPage;
