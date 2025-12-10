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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup attempt:", formData);
  };

  return (
    <div className="min-h-screen bg-purple-700 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* LEFT SECTION */}
        <div className="flex flex-col items-center justify-center lg:sticky lg:top-8 lg:self-start">
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
            
            <h2 className="text-3xl font-bold text-black mb-2">
              Create an Account
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Join SkillBridge to connect with NGOs and volunteering opportunities
            </p>

            {/* Username */}
            <div className="mb-5">
              <label className="block text-black font-semibold mb-2 text-sm">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-black font-semibold mb-2 text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-black font-semibold mb-2 text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Full Name */}
            <div className="mb-5">
              <label className="block text-black font-semibold mb-2 text-sm">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name or organization name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Role */}
            <div className="mb-5">
              <label className="block text-black font-semibold mb-2 text-sm">
                I am a
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select your role</option>
                <option value="Volunteer">Volunteer</option>
                <option value="NGO / Organization">NGO / Organization</option>
              </select>
            </div>

            {/* Conditional Fields for Volunteer */}
            {formData.role === "Volunteer" && (
              <>
                {/* Skills */}
                <div className="mb-5">
                  <label className="block text-black font-semibold mb-2 text-sm">
                    Skills <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="skills"
                    placeholder="e.g. web development, teaching, design (comma separated)"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </>
            )}

            {/* Conditional Fields for NGO/Organization */}
            {formData.role === "NGO / Organization" && (
              <>
                {/* Organization Description */}
                <div className="mb-5">
                  <label className="block text-black font-semibold mb-2 text-sm">
                    Organization Description
                  </label>
                  <textarea
                    name="organizationDescription"
                    placeholder="Tell us about your organization's mission and goals"
                    value={formData.organizationDescription}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                {/* Website URL */}
                <div className="mb-5">
                  <label className="block text-black font-semibold mb-2 text-sm">
                    Website URL <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    name="websiteUrl"
                    placeholder="https://www.yourorganization.org"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </>
            )}

            {/* Location */}
            <div className="mb-8">
              <label className="block text-black font-semibold mb-2 text-sm">
                Location <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Delhi"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* CREATE ACCOUNT BUTTON */}
            <button
              onClick={handleSubmit}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-md text-base transition-colors"
            >
              Create Account
            </button>

            {/* Footer */}
            <p className="text-center text-gray-600 mt-6 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-purple-600  hover:text-blue-600 font-semibold"
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