import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateOpportunity.css";

const CreateOpportunity = () => {
  const navigate = useNavigate();

  const SKILLS_LIST = [
    "Web Development",
    "React",
    "Node.js",
    "UI/UX Design",
    "Graphic Design",
    "Digital Marketing",
    "Content Writing",
    "Python",
    "Java",
    "Data Analysis"
  ];

  const [skills, setSkills] = useState([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    location: "",
    status: "OPEN"
  });

  const [error, setError] = useState("");

  // ✅ NGO-only access check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (!user.userType || user.userType.trim().toUpperCase() !== "NGO") {
      setError("Access denied. Only NGO users can create opportunities.");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillSelect = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setShowSkillDropdown(false);
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // ✅ BACKEND API CALL
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (skills.length === 0) {
      setError("Please select at least one required skill.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Invalid session. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          skills,
          status: formData.status?.toUpperCase() === "CLOSED" ? "CLOSED" : "OPEN"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create opportunity");
      }

      alert("Opportunity created successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="opportunity-container">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>Create New Opportunity</h2>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <form className="opportunity-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" name="title" required onChange={handleChange} />

        <label>Description</label>
        <textarea name="description" required onChange={handleChange} />

        <label>Required Skills</label>
        <div
          className="skill-input-box"
          onClick={() => setShowSkillDropdown(true)}
        >
          {skills.length === 0 && (
            <span className="placeholder-text">Select required skills</span>
          )}

          {skills.map((skill) => (
            <span key={skill} className="skill-chip">
              {skill}
              <span
                className="remove-skill"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSkill(skill);
                }}
              >
                ×
              </span>
            </span>
          ))}
        </div>

        {showSkillDropdown && (
          <div className="skill-dropdown">
            {SKILLS_LIST.map((skill) => (
              <div
                key={skill}
                className={`skill-option ${
                  skills.includes(skill) ? "disabled" : ""
                }`}
                onClick={() =>
                  !skills.includes(skill) && handleSkillSelect(skill)
                }
              >
                {skill}
              </div>
            ))}
          </div>
        )}

        <div className="row">
          <div>
            <label>Duration</label>
            <input name="duration" onChange={handleChange} />
          </div>

          <div>
            <label>Location</label>
            <input name="location" onChange={handleChange} />
          </div>
        </div>

        <label>Status</label>
        <select name="status" onChange={handleChange}>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>

        <div className="actions">
          <button type="button" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOpportunity;
