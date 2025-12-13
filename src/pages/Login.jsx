// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";


export default function Login() {
  const navigate = useNavigate();

  // form state as an object (optimized)
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const err = {};
    if (!form.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Enter a valid email";
    if (!form.password) err.password = "Password is required";
    else if (form.password.length < 6) err.password = "Password must be at least 6 characters";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      // For now we just navigate to dashboard (replace with real auth later)
      navigate("/dashboard");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* LEFT: Feature column */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-500 text-white p-10 overflow-y-auto">
        <div className="flex items-center mb-8">
          <Logo size={40} />
        </div>

        <h1 className="text-5xl font-extrabold leading-tight mb-4">Empowering Change <br /> Through Connection</h1>
        <p className="max-w-lg text-blue-100 mb-8">
          Bridge the gap between passionate volunteers and impactful NGOs.
          Together, we're building a stronger community.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <div className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
            <h3 className="font-semibold text-lg">Find Your Cause</h3>
            <p className="text-sm text-blue-100 mt-2">Match with NGOs that align with your passion</p>
          </div>
          <div className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
            <h3 className="font-semibold text-lg">Build Networks</h3>
            <p className="text-sm text-blue-100 mt-2">Connect with like-minded changemakers</p>
          </div>
          <div className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
            <h3 className="font-semibold text-lg">Track Impact</h3>
            <p className="text-sm text-blue-100 mt-2">Measure your contribution to society</p>
          </div>
          <div className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
            <h3 className="font-semibold text-lg">Make a Difference</h3>
            <p className="text-sm text-blue-100 mt-2">Create meaningful social impact</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-auto">
          <hr className="border-white/10 mb-6" />
          <div className="flex gap-10 text-center">
            <div>
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-sm text-blue-100">Active NGOs</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">10K+</h3>
              <p className="text-sm text-blue-100">Volunteers</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">50K+</h3>
              <p className="text-sm text-blue-100">Impact Hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Login form */}
      <div className="flex items-center justify-center p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-extrabold mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-6">Please enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Email Address</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="you@example.com"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                placeholder="Enter your password"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>

              <button type="button" className="text-sm text-blue-600 hover:underline">Forgot Password?</button>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold mt-2">
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don’t have an account?{" "}
            <span className="text-blue-600 font-semibold hover:underline cursor-pointer" onClick={() => navigate("/signup")}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}
