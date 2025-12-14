import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SkillBridgeLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  // Validators
  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Enter a valid email";
    return "";
  };

  const validatePassword = (value) => {
    if (!value.trim()) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      const res = await axios.post("http://localhost:4001/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful!");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold mb-10 text-white">SkillBridge</h1>
          <div className="w-72 h-72 rounded-full overflow-hidden bg-white shadow-2xl">
            <img
              src="/home.jpeg"
              alt="Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
            <h2 className="text-3xl font-bold mb-3">Sign in</h2>
            <p className="text-gray-600 mb-8">Enter your details</p>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-5">
                <label className="block font-semibold mb-2 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-purple-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block font-semibold mb-2 text-sm">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-purple-500"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition"
              >
                Login
              </button>
            </form>

            <p className="text-center text-sm mt-6">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-purple-600 font-semibold"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
