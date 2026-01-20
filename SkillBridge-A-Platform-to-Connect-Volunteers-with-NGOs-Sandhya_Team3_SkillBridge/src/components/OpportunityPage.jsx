
import React, { useState, useEffect } from "react";

import "./OpportunityPage.css";

const allSkills = ["HTML", "CSS", "JavaScript", "UI/UX", "Figma", "Content Writing"];

export default function OpportunityPage() {
  const [location, setLocation] = useState("All");
  const [status, setStatus] = useState("All");
  const [skills, setSkills] = useState([]);
  const [showSkills, setShowSkills] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [opportunities, setOpportunities] = useState([]);

  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const resetFilters = () => {
    setLocation("All");
    setStatus("All");
    setSkills([]);
  };

  const filteredOpportunities = opportunities.filter((op) => {
    const locMatch = location === "All" || op.location === location;
    const statusMatch = status === "All" || op.status === status;
    const skillsMatch = skills.length === 0 || skills.every((s) => op.skills.includes(s));
    return locMatch && statusMatch && skillsMatch;
  });
  useEffect(() => {
     const stored = localStorage.getItem("ngoOpportunities");
     if (stored) {
      setOpportunities(JSON.parse(stored));
     }
  }, []);

  return (
    <div className="page">
      <h1>Volunteer Opportunities</h1>

      {/* FILTER BAR */}
      <div className="filter-card">
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="All">All Locations</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
        </select>

        <div className="skill-dropdown">
          <button onClick={() => setShowSkills(!showSkills)}>
            Skills {skills.length > 0 && `(${skills.length})`}
          </button>

          {showSkills && (
            <div className="skill-menu">
              {allSkills.map((skill) => (
                <label key={skill}>
                  <input
                    type="checkbox"
                    checked={skills.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                  />
                  {skill}
                </label>
              ))}
            </div>
          )}
        </div>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>

        <button className="reset-btn" onClick={resetFilters}>Reset Filters</button>
      </div>

      {/* OPPORTUNITY CARDS */}
      {filteredOpportunities.map((op) => (
        <div className="card" key={op.id}>
          <div className="card-header">
            <h2>{op.title}</h2>
            <span className={`status ${op.status.toLowerCase()}`}>
              {op.status}
            </span>
          </div>

          <p>{op.description}</p>

          <div className="info">
            <span><b>NGO:</b> {op.ngo}</span>
            <span><b>Location:</b> {op.location}</span>
            <span><b>Posted:</b> {op.postedOn}</span>
            <span><b>Duration:</b> {op.duration}</span>
          </div>

          <div className="skills">
            {op.skills.map((s) => (
              <span key={s} className="skill-pill">{s}</span>
            ))}
          </div>

          <div className="actions">
            <button onClick={() => setViewData(op)}>View Details</button>
            <button
              className="apply"
              disabled={op.status === "Closed"}
              onClick={() => {
                const user = JSON.parse(localStorage.getItem("userProfile"));

                // ❌ Prevent NGO from applying to its own opportunity
                if (user?.role === "ngo" && op.ngo === user.name) {
                  alert("You cannot apply to your own opportunity.");
                  return;
                }

                localStorage.setItem("selectedOpportunity", JSON.stringify(op));
                window.location.href = "/apply";
              }}
            >
              Apply
            </button>

          </div>
        </div>
      ))}

      {/* VIEW DETAILS MODAL */}
      {viewData && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{viewData.title}</h2>
            <p>{viewData.detailedDescription}</p>

            <p><b>NGO:</b> {viewData.ngo}</p>
            <p><b>Location:</b> {viewData.location}</p>
            <p><b>Posted On:</b> {viewData.postedOn}</p>
            <p><b>Duration:</b> {viewData.duration}</p>
            <p><b>Status:</b> {viewData.status}</p>

            <div className="skills">
              {viewData.skills.map((s) => (
                <span key={s} className="skill-pill">{s}</span>
              ))}
            </div>

            <button className="close-btn" onClick={() => setViewData(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
