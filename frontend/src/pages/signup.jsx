import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
 
import logo from "../assets/logo.svg";
import illustration from "../assets/illustration.png";
 
import userIcon from "../assets/user.svg";
import mailIcon from "../assets/mail.svg";
import nameIcon from "../assets/fullname.svg";
import lockIcon from "../assets/lock.svg";
import eyeIcon from "../assets/eye.svg";
import downIcon from "../assets/down.svg";
 
const Signup = () => {
  const navigate = useNavigate();
 
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
 
  const [skills, setSkills] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const payload = {
      username,
      email,
      password,
      fullName,
      role,
      skills: role === "Volunteer" ? skills : undefined,
      organizationDescription: role === "NGO" ? orgDescription : undefined,
    };
 
    try {
      await axios.post("http://localhost:8000/api/auth/signup", payload);
      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };
 
  return (
    <div className="h-screen bg-[#E9F5F8] flex items-center justify-center px-4 sm:px-8 lg:px-10 overflow-hidden">
      {/* Top Logo */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-10 flex items-center gap-3">
        <img src={logo} alt="SkillBridge" className="h-12 sm:h-14 w-auto" />
      </div>
 
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[2.5fr_3fr] gap-8 lg:gap-10 items-center">
        {/* LEFT: Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl px-6 sm:px-8 lg:px-10 py-8 sm:py-10 w-full max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#183B56]">
            Create an Account
          </h2>
          <p className="text-slate-600 mt-1 mb-6 text-sm">
            Join SkillBridge and make an impact
          </p>
 
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <div className="flex items-center border rounded-xl px-3 py-2.5 gap-3">
                <img src={userIcon} className="h-4 opacity-70" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>
 
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <div className="flex items-center border rounded-xl px-3 py-2.5 gap-3">
                <img src={mailIcon} className="h-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>
 
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="flex items-center border rounded-xl px-3 py-2.5 gap-3">
                <img src={lockIcon} className="h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full outline-none text-sm"
                />
                <img
                  src={eyeIcon}
                  className="h-4 opacity-70 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>
 
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <div className="flex items-center border rounded-xl px-3 py-2.5 gap-3">
                <img src={nameIcon} className="h-4 opacity-70" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name or organization name"
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>
 
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                I am a
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full appearance-none border rounded-xl px-3 py-2.5 pr-10 text-sm bg-white"
                >
                  <option value="">Select role</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="NGO">NGO</option>
                </select>
                <img
                  src={downIcon}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 opacity-60"
                />
              </div>
            </div>
 
            {/* Conditional fields */}
            {role === "Volunteer" && (
              <div>
                <label className="block mb-1 text-gray-600 text-sm">
                  Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g. Web Development, Teaching"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm"
                />
              </div>
            )}
 
            {role === "NGO" && (
              <div>
                <label className="block mb-1 text-gray-600 text-sm">
                  Organization Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your organization"
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm resize-none"
                />
              </div>
            )}
 
            <button
              type="submit"
              className="w-full bg-[#FF7A30] hover:bg-[#e96a24] text-white py-3 rounded-xl font-semibold transition"
            >
              Create Account
            </button>
          </form>
 
          <p className="text-center text-slate-600 mt-4 text-sm">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="font-medium cursor-pointer hover:underline"
              style={{ color: "#6EC0CE" }}
            >
              Login
            </span>
          </p>
        </div>
 
        {/* RIGHT: Illustration */}
        <div className="hidden lg:flex w-auto h-[800px] items-center justify-center">
          <img
            src={illustration}
            alt="Signup Illustration"
            className="h-full w-auto object-contain max-w-2xl"
          />
        </div>
      </div>
    </div>
  );
};
 
export default Signup;