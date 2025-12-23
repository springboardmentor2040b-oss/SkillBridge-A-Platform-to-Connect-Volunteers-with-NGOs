import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Opportunities.css";

const OpportunityModal = ({ opportunity, isOwner, isEditMode, onClose }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState(opportunity.title);
  const [description, setDescription] = useState(opportunity.description);
  const [skills, setSkills] = useState(opportunity.skills?.join(", ") || "");
  const [duration, setDuration] = useState(opportunity.duration || "");
  const [location, setLocation] = useState(opportunity.location || "");
  const [status, setStatus] = useState(opportunity.status || "OPEN");
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    setTitle(opportunity.title);
    setDescription(opportunity.description);
    setSkills(opportunity.skills?.join(", ") || "");
    setDuration(opportunity.duration || "");
    setLocation(opportunity.location || "");
    setStatus(opportunity.status || "OPEN");
    setApplyError("");
  }, [opportunity]);

  const isOpen = opportunity.status === "OPEN";

  // ---------------- UPDATE ----------------
  const handleUpdate = async () => {
    try {
      const updatedOpportunity = {
        title,
        description,
        skills: skills.split(",").map((s) => s.trim()),
        duration,
        location,
        status,
      };

      await axios.put(
        `http://localhost:5000/api/opportunities/${opportunity._id}`,
        updatedOpportunity,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Opportunity updated successfully!");
      onClose();
    } catch (err) {
      console.error("Update error:", err.response || err.message);
      alert(err.response?.data?.message || "Failed to update opportunity.");
    }
  };

  // ---------------- APPLY ----------------
  const handleApply = () => {
    if (!isOpen) {
      setApplyError(
        "This opportunity is closed. Applications are no longer accepted."
      );
      return;
    }

    navigate(`/apply/${opportunity._id}`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose}>
          ✕
        </button>

        {/* ================= EDIT MODE ================= */}
        {isEditMode ? (
          <div>
            <h2 className="modal-title">Edit Opportunity</h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />

            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Skills (comma separated)"
            />

            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration"
            />

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
            />

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
            </select>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={onClose}>
                Close
              </button>
              <button className="btn-primary" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          /* ================= VIEW MODE ================= */
          <div>
            <h2 className="modal-title">View Opportunity</h2>

            <h3>{opportunity.title}</h3>
            <p>{opportunity.description}</p>

            <p>
              <strong>Skills:</strong>{" "}
              {opportunity.skills?.join(", ")}
            </p>

            <p>
              <strong>Duration:</strong> {opportunity.duration}
            </p>

            <p>
              <strong>Location:</strong> {opportunity.location}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={isOpen ? "status-open" : "status-closed"}>
                {opportunity.status}
              </span>
            </p>

            {applyError && (
              <p className="error-text">{applyError}</p>
            )}

            <div className="modal-actions">
              <button className="btn-secondary" onClick={onClose}>
                Close
              </button>

              <button className="btn-apply-green" onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityModal;
