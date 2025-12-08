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
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
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

              {/* 👇 Correct image from PUBLIC folder */}
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

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-3 text-sm">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name or NGO name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-3 text-sm">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-3 text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-3 text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />
            </div>

            {/* Role */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-3 text-sm">
                I am a
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-gray-700"
              >
                <option value="">Select your role</option>
                <option value="volunteer">Volunteer</option>
                <option value="ngo">NGO</option>
              </select>
            </div>

            {/* Location */}
            <div className="mb-8">
              <label className="block text-black font-semibold mb-3 text-sm">
                Location <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Delhi"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
              />
            </div>

            {/* CREATE ACCOUNT BUTTON */}
            <button
              onClick={handleSubmit}
              className="w-full bg-purple-700 hover:bg-custom-orange-dark text-white font-bold py-4 rounded-xl shadow-lg text-lg tracking-wide"
            >
              Create Account
            </button>

            {/* Footer */}
            <p className="text-center text-gray-600 mt-10 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-500 hover:text-cyan-600 font-semibold"
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
