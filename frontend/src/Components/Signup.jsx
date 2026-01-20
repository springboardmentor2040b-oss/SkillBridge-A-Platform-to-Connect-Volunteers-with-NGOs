import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    userType: "",
    location: "",
    organizationName: "",
    organizationDescription: "",
    websiteUrl: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🔹 Use exact backend endpoint
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // 🔹 backend sends data.message on error
        setError(data.message || "Signup failed");
        return;
      }

      // ✅ Check for both user and token
      if (!data.user || !data.token) {
        setError("Invalid server response. Please try again.");
        return;
      }

      // 🔹 Save in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p className="subtitle">
          Join SkillBridge to connect with NGOs and volunteering opportunities
        </p>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Full Name</label>
          <input
            name="fullName"
            placeholder="Enter your full name or organization name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label>I am a</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="NGO">NGO / Organization</option>
            <option value="Volunteer">Volunteer</option>
          </select>

          {formData.userType === "NGO" && (
            <>
              <label>Organization Name</label>
              <input
                name="organizationName"
                placeholder="Enter your organization's name"
                value={formData.organizationName}
                onChange={handleChange}
                required
              />

              <label>Organization Description</label>
              <textarea
                name="organizationDescription"
                placeholder="Tell us about your organization's mission and goals"
                value={formData.organizationDescription}
                onChange={handleChange}
                required
              />

              <label>Website URL (Optional)</label>
              <input
                type="url"
                name="websiteUrl"
                placeholder="https://www.yourorganization.org"
                value={formData.websiteUrl}
                onChange={handleChange}
              />
            </>
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit" className="auth-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
