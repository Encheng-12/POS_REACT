import { useEffect, useState, useCallback } from "react";
import { getPayments } from "../services/paymentapi.js";

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "cash", label: "Cash" },
  { key: "aba", label: "ABA" },
  { key: "acleda", label: "ACLEDA" },
  { key: "wing", label: "WING" },
];

function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  const [activeFilter, setActiveFilter] = useState("all");

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getPayments(currentPage, activeFilter);

      setPayments(result.payments || []);
      setPagination(
        result.pagination || { currentPage: 1, lastPage: 1, total: 0 }
      );
    } catch (err) {
      console.error("Error loading payments:", err);
      setError(err.message || "Failed to load payment records.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeFilter]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleFilterChange = (method) => {
    if (method === activeFilter) return;
    setActiveFilter(method);
    setCurrentPage(1); // Reset back to page 1 on filter switch
  };

  // Metrics calculated from current view page
  const pageTotalPayments = payments.length;
  const pageTotalAmount = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );
  const pageCashAmount = payments
    .filter((p) => p.paymentMethod?.toLowerCase() === "cash")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pageDigitalAmount = payments
    .filter((p) =>
      ["aba", "acleda", "wing"].includes(p.paymentMethod?.toLowerCase())
    )
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const getBadgeStyle = (method) => {
    switch (method?.toLowerCase()) {
      case "cash":
        return "bg-emerald-100 text-emerald-700";
      case "aba":
        return "bg-blue-100 text-blue-700";
      case "acleda":
        return "bg-purple-100 text-purple-700";
      case "wing":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="rounded-xl bg-white p-7">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor customer payments and transaction records
        </p>
      </div>

      {/* Payment Method Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => handleFilterChange(filter.key)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeFilter === filter.key
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Error Feedback */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <div className="py-12 text-center text-sm text-gray-500">
          Loading payments...
        </div>
      ) : (
        <>
          {/* Summary Cards (Reflecting fetched data) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                {activeFilter === "all" ? "Total Records" : "Filtered Records"}
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {pagination.total ?? pageTotalPayments}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Page Total Amount</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ${pageTotalAmount.toFixed(2)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Cash (Page)</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ${pageCashAmount.toFixed(2)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Digital (Page)</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ${pageDigitalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Payment Table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50 text-left">
                    <th className="px-6 py-4 font-semibold text-gray-900">Payment</th>
                    <th className="px-6 py-4 font-semibold text-gray-900">Order</th>
                    <th className="px-6 py-4 font-semibold text-gray-900">Method</th>
                    <th className="px-6 py-4 font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-4 font-semibold text-gray-900">Reference</th>
                    <th className="px-6 py-4 font-semibold text-gray-900">Paid At</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                        No payments found.
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          #{payment.id}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {payment.order?.invoice_no
                            ? payment.order.invoice_no
                            : payment.orderId
                            ? `Order #${payment.orderId}`
                            : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium uppercase ${getBadgeStyle(
                              payment.paymentMethod
                            )}`}
                          >
                            {payment.paymentMethod || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          ${Number(payment.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {payment.referenceNo || "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {payment.paidAt
                            ? new Date(payment.paidAt).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Dynamic Pagination Controls */}
              {pagination.lastPage > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                  <p className="text-sm text-gray-500">
                    Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} items)
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 disabled:opacity-50 hover:bg-gray-50"
                    >
                      Prev
                    </button>

                    {Array.from(
                      { length: pagination.lastPage },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-lg px-3 py-1.5 text-sm ${
                          currentPage === page
                            ? "bg-emerald-500 text-white"
                            : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, pagination.lastPage)
                        )
                      }
                      disabled={currentPage === pagination.lastPage}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 disabled:opacity-50 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PaymentPage;