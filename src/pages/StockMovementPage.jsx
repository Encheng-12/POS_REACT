import { useNavigate } from "react-router";
import Filters from "../components/Filters.jsx";
function StockMovementPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stocks</h1>
          <p className="text-gray-500 mt-1">
            Inventory movements: restocks, sales & adjustments
          </p>
        </div>

        <button
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-xl"
          onClick={() => navigate("/add-stock-movement")}
        >
          + New movement
        </button>
      </div>
      {/* Filters */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-3">
          <button
            className="bg-green-500 text-white px-5 py-2 rounded-full font-medium"
            onClick={() => navigate("/add-stock-movement")}
          >
            All
          </button>

          <button
            className="bg-gray-100 text-gray-600 px-5 py-2 rounded-full font-medium"
            onClick={() => navigate("/add-stock-movement")}
          >
            In
          </button>

          <button
            className="bg-gray-100 text-gray-600 px-5 py-2 rounded-full font-medium"
            onClick={() => navigate("/add-stock-movement")}
          >
            Out
          </button>

          <button
            className="bg-gray-100 text-gray-600 px-5 py-2 rounded-full font-medium"
            onClick={() => navigate("/add-stock-movement")}
          >
            Adjustment
          </button>
        </div>
      </div> */}
      <Filters />
      {/* Table */}
    </>
  );
}

export default StockMovementPage;
