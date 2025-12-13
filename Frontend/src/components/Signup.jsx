import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SkillBridgeSignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "",
    location: "",
    Bio: "",
    organisationName: "",
    organizationUrl: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4001/signup", formData);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col items-center justify-center lg:sticky lg:top-8">
          <h1 className="text-6xl font-bold mb-16 text-white">SkillBridge</h1>
          <div className="w-full max-w-lg aspect-square">
            <div className="w-full h-full rounded-full shadow-2xl overflow-hidden bg-gray-200">
              <img
                src="/Ellipse.jpg"
                alt="SkillBridge Illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-12">
            <h2 className="text-3xl font-bold text-black mb-5">
              Create an Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                name="fullName"
                placeholder="Full Name / NGO Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />

              <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              >
                <option value="">Select Role</option>
                <option value="volunteer">Volunteer</option>
                <option value="ngo">NGO</option>
              </select>

              {/* NGO ONLY */}
              {formData.role === "ngo" && (
                <>
                  <input
                    name="organisationName"
                    placeholder="Organization Name"
                    value={formData.organisationName}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
                  />

                  <input
                    name="organizationUrl"
                    placeholder="Organization Website URL (optional)"
                    value={formData.organizationUrl}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
                  />
                </>
              )}

              <input
                name="location"
                placeholder={
                  formData.role === "ngo"
                    ? "Location (required for NGO)"
                    : "Location (optional)"
                }
                value={formData.location}
                onChange={handleChange}
                required={formData.role === "ngo"}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />

              <input
                name="Bio"
                placeholder="Bio (optional)"
                value={formData.Bio}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />

              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 rounded-xl"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-purple-600 font-semibold"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
