import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

import logo from "../assets/logo.svg";
import illustration from "../assets/illustration.png";
import mailIcon from "../assets/mail.svg";
import lockIcon from "../assets/lock.svg";
import eyeIcon from "../assets/eye.svg";

const Login = () => {
  const navigate = useNavigate();
  // ✅ GET loginUser function from AuthContext
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("LOGIN DATA BEING SENT:", { email, password });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const { token, user } = response.data;
      
      // ✅ SAVE TO LOCALSTORAGE (already doing)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // ✅ ADD THIS: Update AuthContext state
      loginUser(user.email, token, user);

      // Navigate based on role
      if (user.role === "ngo") {
        navigate("/ngo/dashboard");
      } else if (user.role === "volunteer") {
        navigate("/volunteer/dashboard");
      } else {
        navigate("/");
      }
      
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen bg-[#E9F5F8] flex items-center justify-center px-4 sm:px-8 lg:px-10 overflow-hidden">

      {/* Top Logo */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-10 flex items-center gap-3">
        <img src={logo} alt="SkillBridge" className="h-12 sm:h-14 w-auto" />
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 lg:gap-16 items-center">

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl px-6 sm:px-8 lg:px-10 py-8 sm:py-10 w-full max-w-xl mx-auto">

          <h2 className="text-2xl sm:text-3xl font-bold text-[#183B56]">
            Login to Your Account
          </h2>

          <p className="text-slate-600 mt-3 mb-8 sm:mb-10">
            Access SkillBridge to manage NGOs and volunteers
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="flex items-center border rounded-xl px-4 py-3 gap-3">
                <img src={mailIcon} alt="" className="h-5" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <img src={lockIcon} alt="" className="h-4" />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none text-sm"
                />

                <img
                  src={eyeIcon}
                  alt="Toggle password visibility"
                  className="h-4 opacity-70 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              </div>
            </div>

            <div
              className="text-left text-sm cursor-pointer"
              style={{ color: "#6EC0CE" }}
            >
              Forgot password?
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF7A30] hover:bg-[#e96a24] text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-slate-600 mt-6 sm:mt-8">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="font-medium cursor-pointer hover:underline"
              style={{ color: "#6EC0CE" }}
            >
              Sign up
            </span>
          </p>
        </div>

        {/* Illustration */}
        <div className="hidden lg:flex relative w-full h-full items-center justify-center">
          <img
            src={illustration}
            alt="Login Illustration"
            className="w-full max-w-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;