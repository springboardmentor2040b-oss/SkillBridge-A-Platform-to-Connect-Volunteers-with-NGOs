import React from "react";

const OpportunityFilterBar = ({
  showMine,
  setShowMine,
  filterStatus,
  setFilterStatus,
}) => {
  const statuses = ["All", "Open", "In Progress", "Closed"];

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center">
      {/* VIEW TOGGLES */}
      <button
        onClick={() => setShowMine(false)}
        className={`px-5 py-2 rounded-md font-medium transition-all
        ${
          !showMine
            ? "bg-[#FF7A30] text-white shadow"
            : "bg-white border hover:bg-gray-50"
        }`}
      >
        View All Opportunities
      </button>

      <button
        onClick={() => setShowMine(true)}
        className={`px-5 py-2 rounded-md font-medium transition-all
        ${
          showMine
            ? "bg-[#FF7A30] text-white shadow"
            : "bg-white border hover:bg-gray-50"
        }`}
      >
        View Your Opportunities
      </button>

      {/* STATUS FILTERS */}
      <div className="flex gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`w-28 px-3 py-1.5 rounded-full text-sm font-medium transition-all
            ${
              filterStatus === status
                ? "bg-[#1f3a5f] text-white shadow"
                : "bg-white border text-gray-600 hover:bg-blue-50 hover:text-[#1f3a5f]"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OpportunityFilterBar;
