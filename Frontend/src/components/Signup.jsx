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
    organizationName: "",
    organizationUrl: "",
    skills: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  // -------- VALIDATION --------
  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    // Volunteer-specific validation
    if (formData.role === "volunteer") {
      if (!formData.skills.trim()) {
        newErrors.skills = "Please enter your skills";
      }
    }

    // NGO-specific validation
    if (formData.role === "ngo") {
      if (!formData.organizationName.trim()) {
        newErrors.organizationName = "Organization name is required";
      }
      
      // URL validation (optional field, but validate if provided)
      if (formData.organizationUrl.trim() && 
          !/^https?:\/\/.+\..+/.test(formData.organizationUrl)) {
        newErrors.organizationUrl = "Enter a valid URL (e.g., https://example.com)";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4001/api/signup",
        formData
      );

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold mb-12 text-white">
            SkillBridge
          </h1>
          <div className="w-[28rem] h-[28rem] rounded-full overflow-hidden bg-white shadow-2xl">
            <img
              src="/Ellipse.jpg"
              alt="SkillBridge"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
            <h2 className="text-3xl font-bold text-black mb-3">
              Create an Account
            </h2>
            <p className="text-gray-600 mb-8">Enter your details</p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <input
                  name="fullName"
                  placeholder="Full Name / NGO Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-purple-500"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <input
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.username
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-purple-500"
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-purple-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-purple-500"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.role
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-purple-500"
                  }`}
                >
                  <option value="">Select Role</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="ngo">NGO</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                )}
              </div>

              {/* SHOW ONLY IF VOLUNTEER */}
              {formData.role === "volunteer" && (
                <div>
                  <input
                    name="skills"
                    placeholder="Skills (e.g., Teaching, Coding, Event Management)"
                    value={formData.skills}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                      errors.skills
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                  />
                  {errors.skills && (
                    <p className="text-red-500 text-xs mt-1">{errors.skills}</p>
                  )}
                </div>
              )}

              {/* SHOW ONLY IF NGO */}
              {formData.role === "ngo" && (
                <>
                  <div>
                    <input
                      name="organizationName"
                      placeholder="Organization Name"
                      value={formData.organizationName}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                        errors.organizationName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-purple-500"
                      }`}
                    />
                    {errors.organizationName && (
                      <p className="text-red-500 text-xs mt-1">{errors.organizationName}</p>
                    )}
                  </div>

                  <div>
                    <input
                      name="organizationUrl"
                      placeholder="Organization Website URL (optional)"
                      value={formData.organizationUrl}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                        errors.organizationUrl
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-purple-500"
                      }`}
                    />
                    {errors.organizationUrl && (
                      <p className="text-red-500 text-xs mt-1">{errors.organizationUrl}</p>
                    )}
                  </div>
                </>
              )}

              {/* Location */}
              <div>
                <input
                  name="location"
                  placeholder="Location (optional)"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Bio */}
              <div>
                <textarea
                  name="Bio"
                  placeholder="Bio (optional)"
                  value={formData.Bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 rounded-xl transition"
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