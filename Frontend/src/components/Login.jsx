import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SkillBridgeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value.trim()) {
      return "Password is required";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors({ ...errors, email: validateEmail(value) });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors({ ...errors, password: validatePassword(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }
    
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SECTION - Hidden on mobile */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold mb-16 text-white">SkillBridge</h1>
          
          <div className="w-full max-w-lg aspect-square">
            <div className="w-full h-full rounded-full shadow-2xl overflow-hidden bg-white">
              <img
                src="/home.jpeg"  
                alt="Illustration"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center justify-center w-full">
          <div className="w-full max-w-md bg-white/95 rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 backdrop-blur">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Sign in to SkillBridge
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Enter your details below to access your account.
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-5">
                <label className="block text-slate-900 font-semibold mb-2 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 text-sm ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="block text-slate-900 font-semibold mb-2 text-sm">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 text-sm ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="text-right mb-6">
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-800 text-xs font-medium"
                >
                  Forgot your password?
                </button>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl shadow-lg text-sm tracking-wide transition"
              >
                Login
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-600 mt-8 text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-purple-600 hover:text-purple-800 font-semibold"
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