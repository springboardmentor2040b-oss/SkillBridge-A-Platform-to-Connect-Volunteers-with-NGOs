import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ApplicationForm.css";

const ApplyOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [opportunity, setOpportunity] = useState(null);
  const [form, setForm] = useState({
    motivation: "",
    availability: "",
    skills: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/opportunities/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setOpportunity(data);
      } catch (err) {
        setError(err.message || "Failed to load opportunity.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id, token, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/applications/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            opportunityId: id,
            ...form,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Application submitted successfully 🎉");
      navigate("/opportunities");
    } catch (err) {
      setError(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAFE RENDERING ================= */
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="application-error">{error}</p>;
  if (!opportunity) return null;

  return (
    <div className="application-page">
      <div className="application-container">
        <h2>Apply for {opportunity.title}</h2>

        <form className="application-form" onSubmit={handleSubmit}>
          <label>Why are you interested?</label>
          <textarea
            name="motivation"
            required
            onChange={handleChange}
          />

          <label>Availability</label>
          <input
            name="availability"
            required
            onChange={handleChange}
          />

          <label>Relevant Skills</label>
          <input
            name="skills"
            onChange={handleChange}
          />

          <div className="application-actions">
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
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

export default ApplyOpportunity;
