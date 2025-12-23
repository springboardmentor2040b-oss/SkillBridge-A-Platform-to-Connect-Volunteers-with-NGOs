import React, { useState } from "react";
import "./Opportunities.css";

const DESCRIPTION_LIMIT = 120;

const OpportunityCard = ({
  opportunity,
  onView,
  onApply,
  onEdit,
  onDelete,
  isOwner,
}) => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  if (!opportunity || !opportunity.status) return null;

  const description = opportunity.description || "";
  const isLongDesc = description.length > DESCRIPTION_LIMIT;

  const displayedDescription = showFullDesc
    ? description
    : description.slice(0, DESCRIPTION_LIMIT);

  return (
    <div className="opportunity-card card-enhanced">
      <div
        className={`card-top-strip ${
          opportunity.status === "OPEN" ? "strip-open" : "strip-closed"
        }`}
      />

      {isOwner && (
        <button className="btn-edit-top" onClick={() => onEdit(opportunity)}>
          Edit
        </button>
      )}

      <h3>{opportunity.title}</h3>

      {/* 🔹 DESCRIPTION WITH SEE MORE */}
      <p className="opportunity-description">
        {displayedDescription}
        {!showFullDesc && isLongDesc && "... "}
        {isLongDesc && (
          <span
            className="see-more-text"
            onClick={() => setShowFullDesc(!showFullDesc)}
          >
            {showFullDesc ? " See less" : " See more"}
          </span>
        )}
      </p>

      <p>
        <strong>Skills:</strong> {opportunity.skills?.join(", ")}
      </p>

      <p>
        <strong>NGO:</strong>{" "}
        {opportunity.createdBy?.organizationName ||
          opportunity.ngoName ||
          "N/A"}
      </p>

      {opportunity.duration && (
        <p>
          <strong>Duration:</strong> {opportunity.duration}
        </p>
      )}

      <span
        className={`status-badge ${
          opportunity.status === "OPEN" ? "status-open" : "status-closed"
        }`}
      >
        {opportunity.status}
      </span>

      {/* 🔹 ACTION ROW */}
      <div className="card-actions action-row">
        <div className="left-actions">
          <button className="btn-secondary" onClick={onView}>
            View Details
          </button>

          {isOwner && (
            <button
              className="btn-danger"
              onClick={() => onDelete(opportunity._id)}
            >
              Delete
            </button>
          )}
        </div>

        {/* Apply always visible */}
        <button
          className="btn-apply-green"
          onClick={() => onApply(opportunity)}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default OpportunityCard;
