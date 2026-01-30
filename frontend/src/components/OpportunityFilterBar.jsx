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
        className={`px-5 py-2.5 rounded-lg font-medium transition-all
          shadow-sm hover:shadow-md hover:-translate-y-[1px]
          ${
            !showMine
              ? "bg-[#FF7A30] text-white"
              : "bg-[#F5F9FC] text-[#1f3a5f] ring-1 ring-slate-200"
          }`}
      >
        View All Opportunities
      </button>

      <button
        onClick={() => setShowMine(true)}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all
          shadow-sm hover:shadow-md hover:-translate-y-[1px]
          ${
            showMine
              ? "bg-[#FF7A30] text-white"
              : "bg-[#F5F9FC] text-[#1f3a5f] ring-1 ring-slate-200"
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
            shadow-sm hover:shadow-md hover:-translate-y-[1px]
            ${
              filterStatus === status
                ? "bg-[#1f3a5f] text-white"
                : "bg-[#F8FBFD] text-slate-600 ring-1 ring-slate-200 hover:text-[#1f3a5f]"
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
