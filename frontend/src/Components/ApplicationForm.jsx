import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ApplicationForm.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ApplicationForm = () => {
  const { id } = useParams(); // opportunity id
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [opportunity, setOpportunity] = useState(null);
  const [form, setForm] = useState({
    motivation: "",
    availability: "",
    skills: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH OPPORTUNITY ================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/opportunities/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOpportunity(res.data);
      } catch (err) {
        console.error("Fetch opportunity error:", err);
        setError(
          err.response?.data?.message || "Failed to load opportunity."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id, token, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= SUBMIT APPLICATION ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.motivation || !form.availability) {
      setError("Please fill all required fields.");
      return;
    }

    setSubmitLoading(true);
    setError("");

    try {
      await axios.post(
        `${API_BASE}/api/applications/apply`,
        {
          opportunityId: id,
          ...form,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Application submitted successfully 🎉");
      navigate("/opportunities");
    } catch (err) {
      console.error("Application submit error:", err);
      setError(
        err.response?.data?.message || "Failed to submit application."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  /* ================= UI STATES ================= */
  if (loading) return <p>Loading opportunity details...</p>;
  if (error && !opportunity)
    return <p className="application-error">{error}</p>;

  return (
    <div className="application-page">
      <div className="application-container">
        <h2>Apply for {opportunity?.title}</h2>

        <p className="application-subtitle">
          Share a few details to help the NGO understand your interest
        </p>

        <form className="application-form" onSubmit={handleSubmit}>
          <label>Why are you interested?</label>
          <textarea
            name="motivation"
            required
            value={form.motivation}
            onChange={handleChange}
          />

          <label>Availability</label>
          <input
            name="availability"
            required
            value={form.availability}
            onChange={handleChange}
          />

          <label>Relevant Skills</label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
          />

          {error && <p className="application-error">{error}</p>}

          <div className="application-actions">
            <button
              className="btn-submit"
              type="submit"
              disabled={submitLoading}
            >
              {submitLoading ? "Submitting..." : "Submit Application"}
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/opportunities")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
