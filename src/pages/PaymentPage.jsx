import { useEffect, useState } from "react";
import { getPayments } from "../services/paymentapi.js";

function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const loadPayments = async () => {
    try {
      setLoading(true);

      const result = await getPayments(currentPage);

      setPayments(result.payments);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = payments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  const totalPayments = payments.length;

  const cashPayments = payments
    .filter((payment) => payment.paymentMethod === "cash")
    .reduce((total, payment) => total + payment.amount, 0);

  const digitalPayments = payments
    .filter(
      (payment) =>
        payment.paymentMethod === "aba" ||
        payment.paymentMethod === "acleda" ||
        payment.paymentMethod === "wing",
    )
    .reduce((total, payment) => total + payment.amount, 0);

  useEffect(() => {
    loadPayments();
  }, [currentPage]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

          <p className="mt-1 text-gray-500">
            Monitor customer payments and transaction records
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Paid At</th>
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
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium">#{payment.id}</td>

                      <td className="px-6 py-4">Order #{payment.orderId}</td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium uppercase">
                          {payment.paymentMethod}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        ${payment.amount.toFixed(2)}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {payment.referenceNo}
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
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
