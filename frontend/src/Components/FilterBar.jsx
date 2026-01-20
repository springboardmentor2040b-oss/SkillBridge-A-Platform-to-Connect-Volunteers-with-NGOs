import React from "react";

const FilterBar = ({ filter, setFilter }) => {
  return (
    <div className="filter-bar">
      <button
        className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
        onClick={() => setFilter("ALL")}
      >
        All
      </button>

      <button
        className={`filter-btn ${filter === "OPEN" ? "active" : ""}`}
        onClick={() => setFilter("OPEN")}
      >
        Open
      </button>

      <button
        className={`filter-btn ${filter === "CLOSED" ? "active" : ""}`}
        onClick={() => setFilter("CLOSED")}
      >
        Closed
      </button>
    </div>
  );
};

export default FilterBar;
