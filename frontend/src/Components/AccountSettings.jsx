import React, { useState, useEffect } from "react";
import "./AccountSettings.css";

const AccountSettings = ({ onUserUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    userType: "",
    location: "",
    organizationName: "",
    organizationDescription: "",
    websiteUrl: "",
    password: ""
  });

  // 🔹 Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setFormData({
      username: storedUser.username || storedUser.fullName || "",
      email: storedUser.email || "",
      fullName: storedUser.fullName || "",
      userType: storedUser.role || storedUser.userType || "",
      location: storedUser.location || "",  // ✅ correct property
      organizationName: storedUser.organizationName || "",
      organizationDescription: storedUser.organizationDescription || "",
      websiteUrl: storedUser.websiteUrl || "",
      password: ""
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      const updatedUser = {
        username: data.user.username || data.user.fullName,
        fullName: data.user.fullName,
        email: data.user.email,
        role: data.user.role,
        location: data.user.location || "",  // ✅ ensures location is always set
        organizationName: data.user.organizationName,
        organizationDescription: data.user.organizationDescription,
        websiteUrl: data.user.websiteUrl
      };

      // 🔹 Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 🔹 Update formData so UI updates immediately
      setFormData(prev => ({ ...prev, ...updatedUser, password: "" }));

      // 🔹 Notify parent (Navbar) if needed
      if (onUserUpdate) onUserUpdate(updatedUser);

      alert("Account updated successfully");
      setEditing(false);

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="account-page">
      <h2 className="page-title">Account Settings</h2>
      <p className="page-subtitle">Manage your profile details and security.</p>

      <div className="account-card">
        {/* Profile summary */}
        <div className="profile-section">
          <div className="avatar">
            {formData.username ? formData.username.charAt(0).toUpperCase() : "U"}
          </div>
          <h3>{formData.username || "User"}</h3>
          <p className="email">{formData.email}</p>
          <span className="badge">{formData.userType}</span>
        </div>

        {/* Editable details */}
        <div className="details-section">
          <div className="details-header">
            <h3>Personal Details</h3>
            <button className="edit-btn" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.email} disabled />
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input type="text" value={formData.userType} disabled />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Organization Name</label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group full-width">
              <label>Organization Description</label>
              <textarea
                name="organizationDescription"
                value={formData.organizationDescription}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group full-width">
              <label>Website URL</label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group full-width">
              <label>New Password</label>
              <input
                type="password"
                name="password"
                placeholder="Leave empty to keep current password"
                value={formData.password}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          {editing && (
            <div className="actions">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
