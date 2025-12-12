import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SkillBridgeSignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "",
    location: "",
    skills: "",
    organizationDescription: "",
    websiteUrl: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "username":
        if (!value.trim()) return "Username is required";
        if (value.length < 3) return "Username must be at least 3 characters";
        return "";
      
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email address";
        return "";
      
      case "password":
        if (!value.trim()) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      
      case "fullName":
        if (!value.trim()) return "Full name is required";
        return "";
      
      case "role":
        if (!value) return "Please select a role";
        return "";
      
      case "organizationDescription":
        if (formData.role === "NGO / Organization" && !value.trim()) {
          return "Organization description is required";
        }
        return "";
      
      case "websiteUrl":
        if (value && !/^https?:\/\/.+\..+/.test(value)) {
          return "Please enter a valid URL";
        }
        return "";
      
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Validate on change
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    console.log("Signup attempt:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 flex items-start justify-center px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

        {/* LEFT SECTION - Hidden on mobile */}
        <div className="hidden lg:flex flex-col items-center justify-center lg:sticky lg:top-8 lg:self-start">
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
        <div className="flex items-center justify-center w-full">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10">
            
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-1">
              Create an Account
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-6">
              Join SkillBridge to connect with NGOs and volunteering opportunities
            </p>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-1.5 text-xs sm:text-sm">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-1.5 text-xs sm:text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-1.5 text-xs sm:text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-1.5 text-xs sm:text-sm">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name or organization name"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Role */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-1.5 text-xs sm:text-sm">
                I am a
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg text-gray-700 focus:outline-none focus:ring-2 ${
                  errors.role ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
              >
                <option value="">Select your role</option>
                <option value="Volunteer">Volunteer</option>
                <option value="NGO / Organization">NGO / Organization</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
            </div>

            {/* Conditional Fields for Volunteer */}
            {formData.role === "Volunteer" && (
              <>
                {/* Skills */}
                <div className="mb-4">
                  <label className="block text-black font-semibold mb-1.5 text-xs sm:text-sm">
                    Skills <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="skills"
                    placeholder="e.g. web development, teaching, design (comma separated)"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </>
            )}

            {/* Conditional Fields for NGO/Organization */}
            {formData.role === "NGO / Organization" && (
              <>
                {/* Organization Description */}
                <div className="mb-4">
                  <label className="block text-black font-semibold mb-1.5 text-xs sm:text-sm">
                    Organization Description
                  </label>
                  <textarea
                    name="organizationDescription"
                    placeholder="Tell us about your organization's mission and goals"
                    value={formData.organizationDescription}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                      errors.organizationDescription ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                    }`}
                  />
                  {errors.organizationDescription && (
                    <p className="text-red-500 text-xs mt-1">{errors.organizationDescription}</p>
                  )}
                </div>

                {/* Website URL */}
                <div className="mb-4">
                  <label className="block text-black font-semibold mb-1.5 text-xs sm:text-sm">
                    Website URL <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    name="websiteUrl"
                    placeholder="https://www.yourorganization.org"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.websiteUrl ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                    }`}
                  />
                  {errors.websiteUrl && (
                    <p className="text-red-500 text-xs mt-1">{errors.websiteUrl}</p>
                  )}
                </div>
              </>
            )}

            {/* Location */}
            <div className="mb-6">
              <label className="block text-black font-semibold mb-1.5 text-xs sm:text-sm">
                Location <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Delhi"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* CREATE ACCOUNT BUTTON */}
            <button
              onClick={handleSubmit}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg shadow-md text-sm sm:text-base transition-colors"
            >
              Create Account
            </button>

            {/* Footer */}
            <p className="text-center text-gray-600 mt-5 text-xs sm:text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-purple-600 hover:text-purple-600 font-semibold"
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