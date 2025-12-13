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
<<<<<<< HEAD
    skills: "",
    organizationDescription: "",
    websiteUrl: "",
=======
    Bio: "",
    organisationName: "",
    organizationUrl: "",
>>>>>>> a45a26c (backend)
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
<<<<<<< HEAD
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
=======
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
>>>>>>> a45a26c (backend)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 flex items-start justify-center px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

<<<<<<< HEAD
        {/* LEFT SECTION - Hidden on mobile */}
        <div className="hidden lg:flex flex-col items-center justify-center lg:sticky lg:top-8 lg:self-start">
          <h1 className="text-6xl font-bold mb-16 text-white">SkillBridge</h1>
=======
        {/* LEFT SECTION */}
        <div className="flex flex-col items-center justify-center lg:sticky lg:top-8">
          <h1 className="text-5xl font-bold mb-16 text-white">SkillBridge</h1>
>>>>>>> a45a26c (backend)

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
<<<<<<< HEAD
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
=======
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-12">
            <h2 className="text-3xl font-bold text-black mb-5">
              Create an Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <input
                name="fullName"
                placeholder="Full Name / NGO Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />

              {/* Username */}
>>>>>>> a45a26c (backend)
              <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
<<<<<<< HEAD
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
=======
                required
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />

              {/* Email */}
>>>>>>> a45a26c (backend)
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
<<<<<<< HEAD
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
=======
                required
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />

              {/* Password */}
>>>>>>> a45a26c (backend)
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
<<<<<<< HEAD
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
=======
                required
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />

              {/* Role */}
>>>>>>> a45a26c (backend)
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
<<<<<<< HEAD
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
=======
                required
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              >
                <option value="">Select Role</option>
                <option value="volunteer">Volunteer</option>
                <option value="ngo">NGO</option>
              </select>

              {/* SHOW ONLY IF NGO */}
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

              {/* Location */}
>>>>>>> a45a26c (backend)
              <input
                name="location"
                placeholder={
                  formData.role === "ngo"
                    ? "Location (required for NGO)"
                    : "Location (optional)"
                }
                value={formData.location}
                onChange={handleChange}
<<<<<<< HEAD
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
=======
                required={formData.role === "ngo"}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />

              {/* Bio */}
              <input
                name="Bio"
                placeholder="Bio (optional)"
                value={formData.Bio}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
>>>>>>> a45a26c (backend)
              />

<<<<<<< HEAD
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
=======
              {/* Submit */}
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
>>>>>>> a45a26c (backend)
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