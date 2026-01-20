import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

const Header = () => {
  const navigate = useNavigate();

  // ✅ Initialize state directly (instead of useEffect)
  const [userEmail, setUserEmail] = useState(() => {
    const email = localStorage.getItem("userEmail");
    return email ? email.split("@")[0] : null;
  });

  const logout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    setUserEmail(null);
    navigate("/");
  };

  return (
    <header className="sticky top-0 bg-[#64B4C8] shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">

        <div className="flex items-center space-x-2">
          <img src={logo} className="h-12 w-auto block"
  draggable="false" />
        </div>

        <nav className="hidden md:flex space-x-8 text-[#183B56] font-medium">
          <a href="#home">Home</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#opportunities">Opportunities</a>
          <a href="#features">Features</a>
          <a href="#testimonials">Testimonials</a>
        </nav>

        {userEmail ? (
          <div className="flex items-center space-x-4">
            <span className="text-[#183B56] font-medium">
              Welcome, {userEmail}
            </span>

            <button
              onClick={logout}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 border border-[#183B56] text-[#183B56] rounded-lg hover:bg-[#183B56] hover:text-white transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: "#FF7A30" }}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
