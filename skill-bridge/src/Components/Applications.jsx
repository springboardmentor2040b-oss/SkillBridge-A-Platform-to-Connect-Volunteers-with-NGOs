import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Applications.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/applications/ngo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApplications(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:5000/api/applications/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setApplications((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status } : a))
    );
  };

  return (
    <div className="applications-page">
      <h2>Applications</h2>

      {applications.map((app) => (
        <div key={app._id} className="application-card">
          <h4>{app.opportunity.title}</h4>
          <p><strong>{app.volunteer.fullName}</strong></p>
          <p>Status: {app.status}</p>

          <div className="actions">
            <button onClick={() => updateStatus(app._id, "ACCEPTED")}>
              Accept
            </button>
            <button onClick={() => updateStatus(app._id, "REJECTED")}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Applications;
