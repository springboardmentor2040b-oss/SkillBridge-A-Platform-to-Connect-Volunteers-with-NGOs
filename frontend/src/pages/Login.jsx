import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";
import { loginUser } from "../services/api.js";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const err = {};
    if (!form.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      err.email = "Enter a valid email";

    if (!form.password) err.password = "Password is required";
    else if (form.password.length < 6)
      err.password = "Password must be at least 6 characters";

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);

    if (Object.keys(err).length === 0) {
      try {
        const res = await loginUser({
          email: form.email.trim().toLowerCase(),
          password: form.password.trim(),
        });

        // ✅ SINGLE SOURCE OF TRUTH
        localStorage.setItem("token", res.data.token);
        const normalizedUser = {
          ...res.data.user,
          _id: res.data.user.id, // ✅ ADD THIS LINE
        };

        localStorage.setItem("currentUser", JSON.stringify(normalizedUser));



// console.log("BEFORE NAVIGATE TOKEN:", localStorage.getItem("token"));
// console.log(
//   "BEFORE NAVIGATE USER:",
//   localStorage.getItem("currentUser")
// );





        navigate("/dashboard");
      } catch (error) {
        alert(error.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* LEFT */}
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

      {/* RIGHT */}
      <div className="flex items-center justify-center p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-extrabold mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-6">
            Please enter your credentials to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Email Address</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="w-full border rounded-lg px-4 py-3"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                className="w-full border rounded-lg px-4 py-3"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 font-semibold cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
