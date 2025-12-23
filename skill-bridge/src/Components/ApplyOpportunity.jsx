import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ApplyOpportunity.css";

const ApplyOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [application, setApplication] = useState({
    motivation: "",
    availability: "",
  });

  /* =========================
     ACCESS CONTROL (EARLY)
     ========================= */
  if (!user || !token) {
    return <p className="error-msg">Please log in to apply.</p>;
  }

  if (user.role !== "Volunteer") {
    return <p className="error-msg">Access denied.</p>;
  }

  /* =========================
     FETCH OPPORTUNITY DETAILS
     ========================= */
  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/opportunities/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const isOpen =
          res.data.status &&
          res.data.status.toUpperCase() === "OPEN";

        if (!isOpen) {
          setError("This opportunity is closed and cannot be applied to.");
        }

        setOpportunity(res.data);
      } catch (err) {
        setError("Failed to load opportunity details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id, token]);

  /* =========================
     HANDLE FORM CHANGE
     ========================= */
  const handleChange = (e) => {
    setApplication({
      ...application,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     SUBMIT APPLICATION
     ========================= */
  const handleApply = async (e) => {
    e.preventDefault();

    if (
      opportunity.status?.toUpperCase() !== "OPEN"
    ) {
      setError("You cannot apply to a closed opportunity.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:5000/api/applications",
        {
          opportunityId: id,
          motivation: application.motivation,
          availability: application.availability,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Application submitted successfully!");
      setTimeout(() => navigate("/opportunities"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Application failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="apply-page">
      <h2>Apply for Opportunity</h2>

      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      {opportunity && (
        <>
          {/* ===== OPPORTUNITY DETAILS ===== */}
          <div className="opportunity-summary">
            <h3>{opportunity.title}</h3>
            <p>
              <strong>Location:</strong> {opportunity.location}
            </p>
            <p>
              <strong>Status:</strong> {opportunity.status}
            </p>
            <p>
              <strong>Required Skills:</strong>{" "}
              {opportunity.skills?.join(", ") || "N/A"}
            </p>
            <p className="description">
              {opportunity.description}
            </p>
          </div>

          {/* ===== APPLY FORM ===== */}
          {opportunity.status?.toUpperCase() === "OPEN" ? (
            <form className="apply-form" onSubmit={handleApply}>
              <label>
                Why are you interested?
                <textarea
                  name="motivation"
                  required
                  value={application.motivation}
                  onChange={handleChange}
                />
              </label>

              <label>
                Availability
                <input
                  type="text"
                  name="availability"
                  required
                  value={application.availability}
                  onChange={handleChange}
                />
              </label>

              <button type="submit" disabled={submitting}>
                {submitting
                  ? "Submitting..."
                  : "Submit Application"}
              </button>
            </form>
          ) : (
            <p className="closed-msg">
              Applications are closed for this opportunity.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ApplyOpportunity;
