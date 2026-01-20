// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";
import API from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("volunteer");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    location: "",
    skills: "",
    organization_name: "",
    organization_description: "",
    website_url: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.full_name,
      email: form.email,
      password: form.password,
      role,
      location: form.location,
      skills:
        role === "volunteer"
          ? form.skills.split(",").map((s) => s.trim())
          : [],
      organization_name:
        role === "ngo" ? form.organization_name : null,
      organization_description:
        role === "ngo" ? form.organization_description : null,
      website_url: role === "ngo" ? form.website_url : null,
    };

    try {
      await API.post("/users/register", payload);
      alert("Account created successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* LEFT – UNCHANGED */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-500 text-white p-10 overflow-y-auto">
        <div className="flex items-center mb-8">
          <Logo size={40} />
        </div>

        <h1 className="text-5xl font-extrabold leading-tight mb-4">
          Empowering Change <br /> Through Connection
        </h1>
        <p className="max-w-lg text-blue-100 mb-8">
          Bridge the gap between passionate volunteers and impactful NGOs.
        </p>
      </div>

      {/* RIGHT – FORM (ROLE BASED) */}
      <div className="flex items-center justify-center p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-extrabold mb-2">
            Create an Account
          </h2>
          <p className="text-gray-600 mb-6">
            Join SkillBridge to connect with NGOs and volunteering opportunities
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="username"
              placeholder="Choose a username"
              className="w-full border rounded-lg px-4 py-3"
              onChange={handleChange}
              required
            />

            <input
              name="email"
              placeholder="Enter your email"
              type="email"
              className="w-full border rounded-lg px-4 py-3"
              onChange={handleChange}
              required
            />

            <input
              name="password"
              placeholder="Create a password"
              type="password"
              className="w-full border rounded-lg px-4 py-3"
              onChange={handleChange}
              required
            />

            <input
              name="full_name"
              placeholder={
                role === "ngo"
                  ? "Organization name"
                  : "Enter your full name"
              }
              className="w-full border rounded-lg px-4 py-3"
              onChange={handleChange}
              required
            />

            {/* ROLE SELECT */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="volunteer">Volunteer</option>
              <option value="ngo">NGO / Organization</option>
            </select>

            <input
              name="location"
              placeholder="Location (Optional)"
              className="w-full border rounded-lg px-4 py-3"
              onChange={handleChange}
            />

            {/* VOLUNTEER ONLY */}
            {role === "volunteer" && (
              <input
                name="skills"
                placeholder="Skills (comma separated)"
                className="w-full border rounded-lg px-4 py-3"
                onChange={handleChange}
              />
            )}

            {/* NGO ONLY */}
            {role === "ngo" && (
              <>
                <input
                  name="organization_name"
                  placeholder="Organization Name"
                  className="w-full border rounded-lg px-4 py-3"
                  onChange={handleChange}
                  required
                />

                <textarea
                  name="organization_description"
                  placeholder="Organization Description"
                  className="w-full border rounded-lg px-4 py-3"
                  onChange={handleChange}
                  required
                />

                <input
                  name="website_url"
                  placeholder="Website URL (Optional)"
                  className="w-full border rounded-lg px-4 py-3"
                  onChange={handleChange}
                />
              </>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold"
            >
              Create Account
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <span
              className="text-blue-600 font-semibold cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
