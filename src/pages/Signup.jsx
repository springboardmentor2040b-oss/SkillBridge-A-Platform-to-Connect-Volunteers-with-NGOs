import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";



export default function Signup() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("volunteer");
  const [form, setForm] = useState({
    volName: "",
    volEmail: "",
    volPhone: "",
    volLocation: "",
    volSkills: "",
    volPassword: "",
    volAgree: false,

    ngoName: "",
    ngoEmail: "",
    ngoPhone: "",
    ngoLocation: "",
    ngoType: "",
    ngoPassword: "",
    ngoAgree: false,
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const isEmail = (s) => /\S+@\S+\.\S+/.test(s);
  const isPhone = (s) => s.replace(/\D/g, "").length >= 10;
  const isPasswordOk = (s) => s && s.length >= 8;

  function validateVolunteer() {
    const err = {};
    if (!form.volName.trim()) err.volName = "Full name is required";
    if (!form.volEmail) err.volEmail = "Email is required";
    else if (!isEmail(form.volEmail)) err.volEmail = "Invalid email address";
    if (!form.volPhone) err.volPhone = "Phone number is required";
    else if (!isPhone(form.volPhone)) err.volPhone = "Phone number is invalid";
    if (!form.volLocation) err.volLocation = "Location is required";
    if (!form.volSkills) err.volSkills = "Please enter your skills";
    if (!isPasswordOk(form.volPassword))
      err.volPassword = "Password must be at least 8 characters";
    if (!form.volAgree) err.volAgree = "You must agree to the terms";
    return err;
  }

  function validateNgo() {
    const err = {};
    if (!form.ngoName.trim()) err.ngoName = "Organization name is required";
    if (!form.ngoEmail) err.ngoEmail = "Email is required";
    else if (!isEmail(form.ngoEmail)) err.ngoEmail = "Invalid email address";
    if (!form.ngoPhone) err.ngoPhone = "Phone number is required";
    else if (!isPhone(form.ngoPhone)) err.ngoPhone = "Phone number is invalid";
    if (!form.ngoLocation) err.ngoLocation = "Location is required";
    if (!form.ngoType) err.ngoType = "Organization type is required";
    if (!isPasswordOk(form.ngoPassword))
      err.ngoPassword = "Password must be at least 8 characters";
    if (!form.ngoAgree) err.ngoAgree = "You must agree to the terms";
    return err;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (activeTab === "volunteer") {
      const vErr = validateVolunteer();
      setErrors(vErr);
      if (Object.keys(vErr).length === 0) {
        alert("Volunteer account created!");
        navigate("/");
      }
    } else {
      const nErr = validateNgo();
      setErrors(nErr);
      if (Object.keys(nErr).length === 0) {
        alert("NGO account created!");
        navigate("/");
      }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">

      <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white p-10 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10">
          <Logo size={45} textColor="white" />

        </div>

        <h1 className="text-5xl font-bold leading-tight">
          Empowering Change <br /> Through Connection
        </h1>

        <p className="mt-4 text-lg text-blue-100 max-w-lg">
          Bridge the gap between passionate volunteers and impactful NGOs.
          Together, we're building a stronger community.
        </p>

        <div className="grid grid-cols-2 gap-6 mt-10">
          <div className="p-5 bg-white bg-opacity-10 backdrop-blur rounded-xl">
            <h3 className="text-xl font-semibold">Find Your Cause</h3>
            <p className="text-blue-100 text-sm mt-2">
              Match with NGOs that align with your passion
            </p>
          </div>

          <div className="p-5 bg-white bg-opacity-10 backdrop-blur rounded-xl">
            <h3 className="text-xl font-semibold">Build Networks</h3>
            <p className="text-blue-100 text-sm mt-2">
              Connect with like-minded changemakers
            </p>
          </div>

          <div className="p-5 bg-white bg-opacity-10 backdrop-blur rounded-xl">
            <h3 className="text-xl font-semibold">Track Impact</h3>
            <p className="text-blue-100 text-sm mt-2">
              Measure your contribution to society
            </p>
          </div>

          <div className="p-5 bg-white bg-opacity-10 backdrop-blur rounded-xl">
            <h3 className="text-xl font-semibold">Make a Difference</h3>
            <p className="text-blue-100 text-sm mt-2">
              Create meaningful social impact
            </p>
          </div>
        </div>

        <div className="flex gap-10 mt-12 text-center">
          <div>
            <h3 className="text-3xl font-bold">500+</h3>
            <p className="text-blue-100 text-sm">Active NGOs</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">10K+</h3>
            <p className="text-blue-100 text-sm">Volunteers</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">50K+</h3>
            <p className="text-blue-100 text-sm">Impact Hours</p>
          </div>
        </div>
      </div>

      <div className="p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-gray-600 mt-2">Select account type to continue</p>

        <div className="flex mt-6 border rounded-lg overflow-hidden w-80">
          <button
            className={`flex-1 py-2 ${
              activeTab === "volunteer"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("volunteer");
              setErrors({});
            }}
          >
            Volunteer
          </button>

          <button
            className={`flex-1 py-2 ${
              activeTab === "ngo"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("ngo");
              setErrors({});
            }}
          >
            NGO
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          {activeTab === "volunteer" && (
            <>
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  name="volName"
                  value={form.volName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full mt-1 px-4 py-3 border rounded-lg"
                />
                {errors.volName && (
                  <p className="text-red-500 text-sm">{errors.volName}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Email Address</label>
                <input
                  name="volEmail"
                  value={form.volEmail}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  type="email"
                  className="w-full mt-1 px-4 py-3 border rounded-lg"
                />
                {errors.volEmail && (
                  <p className="text-red-500 text-sm">{errors.volEmail}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  name="volPhone"
                  value={form.volPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full mt-1 px-4 py-3 border rounded-lg"
                />
                {errors.volPhone && (
                  <p className="text-red-500 text-sm">{errors.volPhone}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Location</label>
                <input
                  name="volLocation"
                  value={form.volLocation}
                  onChange={handleChange}
                  placeholder="City, State"
                  className="w-full mt-1 px-4 py-3 border rounded-lg"
                />
                {errors.volLocation && (
                  <p className="text-red-500 text-sm">{errors.volLocation}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Skills & Expertise</label>
                <input
                  name="volSkills"
                  value={form.volSkills}
                  onChange={handleChange}
                  placeholder="e.g., Teaching, IT Support"
                  className="w-full mt-1 px-4 py-3 border rounded-lg"
                />
                {errors.volSkills && (
                  <p className="text-red-500 text-sm">{errors.volSkills}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  name="volPassword"
                  value={form.volPassword}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  type="password"
                  className="w-full mt-1 px-4 py-3 border rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters long
                </p>
                {errors.volPassword && (
                  <p className="text-red-500 text-sm">{errors.volPassword}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  name="volAgree"
                  type="checkbox"
                  checked={form.volAgree}
                  onChange={handleChange}
                />
                <label className="text-sm text-gray-700">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
              {errors.volAgree && (
                <p className="text-red-500 text-sm">{errors.volAgree}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mt-2"
              >
                Create Account
              </button>
            </>
          )}

          {activeTab === "ngo" && (
            <>
              <div>
                <label className="text-sm font-medium">Organization Name</label>
                <input
                  name="ngoName"
                  value={form.ngoName}
                  onChange={handleChange}
                  placeholder="Your organization"
                  className="w-full mt-1 px-4 py-3 border rounded-lg"
                />
                {errors.ngoName && (
                  <p className="text-red-500 text-sm">{errors.ngoName}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  name="ngoEmail"
                  value={form.ngoEmail}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  type="email"
                  className="w-full mt-1 px-4 py-3 border rounded-lg"
                />
                {errors.ngoEmail && (
                  <p className="text-red-500 text-sm">{errors.ngoEmail}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  name="ngoPhone"
                  value={form.ngoPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full mt-1 px-4 py-3 border rounded-lg"
                />
                {errors.ngoPhone && (
                  <p className="text-red-500 text-sm">{errors.ngoPhone}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Location</label>
                <input
                  name="ngoLocation"
                  value={form.ngoLocation}
                  onChange={handleChange}
                  placeholder="City, State"
                  className="w-full mt-1 px-4 py-3 border rounded-lg"
                />
                {errors.ngoLocation && (
                  <p className="text-red-500 text-sm">{errors.ngoLocation}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Organization Type</label>
                <input
                  name="ngoType"
                  value={form.ngoType}
                  onChange={handleChange}
                  placeholder="Select organization type"
                  className="w-full mt-1 px-4 py-3 border rounded-lg"
                />
                {errors.ngoType && (
                  <p className="text-red-500 text-sm">{errors.ngoType}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  name="ngoPassword"
                  value={form.ngoPassword}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  type="password"
                  className="w-full mt-1 px-4 py-3 border rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters long
                </p>
                {errors.ngoPassword && (
                  <p className="text-red-500 text-sm">{errors.ngoPassword}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  name="ngoAgree"
                  type="checkbox"
                  checked={form.ngoAgree}
                  onChange={handleChange}
                />
                <label className="text-sm text-gray-700">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
              {errors.ngoAgree && (
                <p className="text-red-500 text-sm">{errors.ngoAgree}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mt-2"
              >
                Create Account
              </button>
            </>
          )}

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-blue-600 font-semibold cursor-pointer"
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
