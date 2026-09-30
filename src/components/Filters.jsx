function Filters({ activeFilter, onFilterChange }) {
  const filters = [
    { label: "All", value: "all" },
    { label: "In", value: "in" },
    { label: "Out", value: "out" },
    { label: "Adjustment", value: "adjustment" },
  ];

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={
              activeFilter === filter.value
                ? "rounded-full bg-green-500 px-5 py-2 font-medium text-white"
                : "rounded-full bg-gray-100 px-5 py-2 font-medium text-gray-600 hover:bg-gray-200"
            }
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Filters;
