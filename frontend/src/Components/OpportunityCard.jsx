import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Opportunities.css";

const DESCRIPTION_LIMIT = 120;

const OpportunityCard = ({
  opportunity,
  isOwner,
  onDelete,
  onEdit,
  onView,
  onApply,
}) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const token = localStorage.getItem("token");

  /* ================= CHECK IF USER HAS APPLIED ================= */
  useEffect(() => {
    const fetchMyApplications = async () => {
      if (!token || !opportunity?._id) return;
      try {
        const res = await axios.get(
          "http://localhost:5000/api/applications/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.includes(opportunity._id)) setHasApplied(true);
      } catch (err) {
        console.error("Failed to fetch applied opportunities:", err);
      }
    };
    fetchMyApplications();
  }, [opportunity?._id, token]);

  if (!opportunity) return null;

  const description = opportunity.description || "";
  const isLongDesc = description.length > DESCRIPTION_LIMIT;
  const displayedDescription = showFullDesc
    ? description
    : description.slice(0, DESCRIPTION_LIMIT);

  /* ================= CONFIRM DELETE ================= */
  const confirmDelete = () => {
    const ok = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );
    if (ok && onDelete) onDelete(opportunity._id);
  };

  return (
    <div className="opportunity-card card-enhanced">
      <div
        className={`card-top-strip ${
          opportunity.status === "OPEN" ? "strip-open" : "strip-closed"
        }`}
      />

      {/* OWNER ACTIONS */}
      {isOwner && (
        <div className="owner-actions">
          <button
            type="button"
            className="btn-edit"
            onClick={() => onEdit && onEdit(opportunity)}
          >
            Edit
          </button>

          <button
            type="button"
            className="btn-delete"
            onClick={confirmDelete}
          >
            Delete
          </button>
        </div>
      )}

      <h3>{opportunity.title}</h3>

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

      <p>
        <strong>Duration:</strong> {opportunity.duration || "N/A"}
      </p>

      <span
        className={`status-badge ${
          opportunity.status === "OPEN" ? "status-open" : "status-closed"
        }`}
      >
        {opportunity.status}
      </span>

      <div className="card-actions action-row">
        <button type="button" className="btn-secondary" onClick={onView}>
          View Details
        </button>

        {!isOwner && opportunity.status === "OPEN" && (
          <button
            type="button"
            className="btn-apply-green"
            onClick={() => onApply && onApply(opportunity)}
            disabled={hasApplied}
            title={hasApplied ? "You have already applied" : ""}
          >
            {hasApplied ? "Already Applied" : "Apply"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;
