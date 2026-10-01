import { useEffect, useState } from "react";
import { getPayments } from "../services/paymentapi.js";

function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const [activeFilter, setActiveFilter] = useState("all");

  const loadPayments = async () => {
    try {
      setLoading(true);

      const result = await getPayments(currentPage, activeFilter);

      setPayments(result.payments);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error loading payments:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [currentPage, activeFilter]);

  const handleMethodChange = (method) => {
    setActiveFilter(method);
    setCurrentPage(1);
  };

  // =========================
  // Payment summary
  // =========================

  const totalPayments = payments.length;

  const totalAmount = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0,
  );

  const cashPayments = payments
    .filter((payment) => payment.paymentMethod === "cash")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const digitalPayments = payments
    .filter(
      (payment) =>
        payment.paymentMethod === "aba" ||
        payment.paymentMethod === "acleda" ||
        payment.paymentMethod === "wing",
    )
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  return (
    <div className="rounded-xl bg-white p-7">
      {/* =========================
          Header
      ========================= */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        {/* <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
          Payment Records
        </Title> */}

        <p className="mt-1 text-sm text-gray-500">
          Monitor customer payments and transaction records
        </p>
      </div>

      {/* =========================
          Payment Filters
      ========================= */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => handleMethodChange("all")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            activeFilter === "all"
              ? "bg-emerald-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>

        <button
          onClick={() => handleMethodChange("cash")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            activeFilter === "cash"
              ? "bg-emerald-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Cash
        </button>

        <button
          onClick={() => handleMethodChange("aba")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            activeFilter === "aba"
              ? "bg-emerald-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          ABA
        </button>

        <button
          onClick={() => handleMethodChange("acleda")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            activeFilter === "acleda"
              ? "bg-emerald-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          ACLEDA
        </button>

        <button
          onClick={() => handleMethodChange("wing")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            activeFilter === "wing"
              ? "bg-emerald-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          WING
        </button>
      </div>

      {/* =========================
          Loading
      ========================= */}
      {loading ? (
        <div className="py-10 text-center text-sm text-gray-500">
          Loading payments...
        </div>
      ) : (
        <>
          {/* =========================
              Summary Cards
          ========================= */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Payments */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Payments</p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalPayments}
              </p>
            </div>

            {/* Total Amount */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Amount</p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                ${totalAmount.toFixed(2)}
              </p>
            </div>

            {/* Cash */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Cash</p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                ${cashPayments.toFixed(2)}
              </p>
            </div>

            {/* Digital */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Digital Payments</p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                ${digitalPayments.toFixed(2)}
              </p>
            </div>
          </div>

          {/* =========================
              Payment Table
          ========================= */}
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50 text-left">
                    <th className="px-6 py-4 font-semibold text-gray-900">
                      Payment
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-900">
                      Order
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-900">
                      Method
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-900">
                      Amount
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-900">
                      Reference
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-900">
                      Paid At
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No payments found.
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                      >
                        {/* Payment ID */}
                        <td className="px-6 py-4 font-medium text-gray-900">
                          #{payment.id}
                        </td>

                        {/* Order */}
                        <td className="px-6 py-4 text-gray-900">
                          {payment.order?.invoice_no
                            ? payment.order.invoice_no
                            : `Order #${payment.orderId}`}
                        </td>

                        {/* Payment Method */}
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium uppercase ${
                              payment.paymentMethod === "cash"
                                ? "bg-emerald-100 text-emerald-700"
                                : payment.paymentMethod === "aba"
                                  ? "bg-blue-100 text-blue-700"
                                  : payment.paymentMethod === "acleda"
                                    ? "bg-purple-100 text-purple-700"
                                    : payment.paymentMethod === "wing"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {payment.paymentMethod}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          ${Number(payment.amount).toFixed(2)}
                        </td>

                        {/* Reference */}
                        <td className="px-6 py-4 text-gray-600">
                          {payment.referenceNo || "-"}
                        </td>

                        {/* Paid At */}
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
          </div>
        </>
      )}
    </div>
  );
}

export default PaymentPage;
