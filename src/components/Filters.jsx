function Filters() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex gap-3">
        <button className="bg-green-500 text-white px-5 py-2 rounded-full font-medium">
          All
        </button>

        <button className="bg-gray-100 text-gray-600 px-5 py-2 rounded-full font-medium">
          In
        </button>

        <button className="bg-gray-100 text-gray-600 px-5 py-2 rounded-full font-medium">
          Out
        </button>

        <button className="bg-gray-100 text-gray-600 px-5 py-2 rounded-full font-medium">
          Adjustment
        </button>
      </div>
    </div>
  );
}

export default Filters;
