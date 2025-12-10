import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SkillBridgeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      {/* LEFT SECTION - ONLY IMAGE */}
<div className="flex flex-col items-center justify-center">
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
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white/95 rounded-3xl shadow-2xl p-10 md:p-12 backdrop-blur">
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
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
                className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3.5 rounded-xl shadow-lg text-sm tracking-wide transition"
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
