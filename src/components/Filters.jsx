function Filters({ activeFilter, onFilterChange }) {
  const filters = [
    { label: "All", value: "all" },
    { label: "In", value: "in" },
    { label: "Out", value: "out" },
    { label: "Adjustment", value: "adjustment" },
  ];

  return (
    <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {filters.map((filter) => {
        const active = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              active
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export default Filters;
