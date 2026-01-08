import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Applications.css";

const Applications = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const userRole = user?.userType?.trim().toUpperCase();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  /* ================= FETCH APPLICATIONS ================= */
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setError("Please login to view applications.");
      return;
    }
    fetchApplications();
  }, []);

  /* ================= VIEW DETAILS ================= */
  const handleViewDetails = async (appId) => {
    try {
      setError("");
      const res = await axios.get(
        `http://localhost:5000/api/applications/view/${appId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedApplication(res.data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch details");
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (status) => {
    if (!selectedApplication) return;
    try {
      setUpdateLoading(true);
      await axios.put(
        `http://localhost:5000/api/applications/${selectedApplication._id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh applications
      await fetchApplications();
      // Refresh selected application
      handleViewDetails(selectedApplication._id);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="applications-page">
      <h1 className="title">
        {userRole === "NGO" ? "Applications Received" : "My Applications"}
      </h1>

      {applications.length === 0 ? (
        <p className="empty-msg">No applications found.</p>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div className="application-card" key={app._id}>
              <h3>{app.opportunity?.title}</h3>

              {userRole === "NGO" && (
                <p>
                  <strong>Volunteer:</strong> {app.volunteer?.fullName} (
                  {app.volunteer?.email})
                </p>
              )}

              {userRole === "VOLUNTEER" && (
                <p>
                  <strong>NGO:</strong> {app.ngo?.organizationName || "N/A"}
                </p>
              )}

              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </p>

              <button
                className="view-btn"
                onClick={() => handleViewDetails(app._id)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && selectedApplication && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedApplication.opportunity?.title}</h2>
            <p>
              <strong>Volunteer:</strong>{" "}
              {selectedApplication.volunteer?.fullName} (
              {selectedApplication.volunteer?.email})
            </p>
            <p>
              <strong>NGO:</strong>{" "}
              {selectedApplication.ngo?.organizationName || "N/A"}
            </p>
            <p>
              <strong>Motivation:</strong>{" "}
              {selectedApplication.motivation}
            </p>
            <p>
              <strong>Availability:</strong>{" "}
              {selectedApplication.availability}
            </p>
            <p>
              <strong>Skills:</strong>{" "}
              {selectedApplication.skills || "N/A"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status ${selectedApplication.status.toLowerCase()}`}
              >
                {selectedApplication.status}
              </span>
            </p>

            {/* NGO Accept/Reject Buttons */}
            {userRole === "NGO" &&
              selectedApplication.status === "PENDING" && (
                <div className="modal-actions">
                  <button
                    className="btn-accept"
                    onClick={() => updateStatus("ACCEPTED")}
                    disabled={updateLoading}
                  >
                    {updateLoading ? "Updating..." : "Accept"}
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => updateStatus("REJECTED")}
                    disabled={updateLoading}
                  >
                    {updateLoading ? "Updating..." : "Reject"}
                  </button>
                </div>
              )}

            <button
              className="btn-close"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
