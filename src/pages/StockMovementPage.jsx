import { useEffect, useState } from "react";
import Filters from "../components/Filters.jsx";
import NewStockMovementModal from "../components/NewStockMovementModal.jsx";
import { getStockMovements } from "../services/stockmovementapi.js";

function StockMovementPage() {
  const [showModal, setShowModal] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");

  const [stockMovements, setStockMovements] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  // const [lastPage, setLastPage] = useState(1);
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
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stocks</h1>

          <p className="mt-1 text-gray-500">
            Inventory movements: restocks, sales & adjustments
          </p>
        </div>

        <button
          className="rounded-xl bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
          onClick={() => setShowModal(true)}
        >
          + New movement
        </button>
      </div>

      {/* Filters */}
      <Filters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : stockMovements.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No stock movements found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Notes</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {stockMovements.map((movement) => (
                  <tr key={movement.id} className="border-b last:border-b-0">
                    <td className="px-6 py-4 font-medium">
                      {movement.productName}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
                          movement.type === "in"
                            ? "bg-green-100 text-green-700"
                            : movement.type === "out"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {movement.type}
                      </span>
                    </td>

                    <td className="px-6 py-4">{movement.quantity}</td>

                    <td className="px-6 py-4">{movement.reference}</td>

                    <td className="px-6 py-4">{movement.notes || "-"}</td>

                    <td className="px-6 py-4">
                      {movement.date
                        ? new Date(movement.date).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            {pagination.lastPage > 1 && (
              <div className="flex items-center justify-between border-t px-6 py-4">
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
                          ? "bg-green-500 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
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

      {/* New Stock Movement Modal */}
      {showModal && (
        <NewStockMovementModal
          onClose={() => setShowModal(false)}
          onCreated={loadStockMovements}
        />
      )}
    </>
  );
}

export default StockMovementPage;
