import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/image.png"; // ✅ correct logo import

const Header = () => {
  return (
    <header
      className="sticky top-0 z-50 shadow-md"
      style={{ backgroundColor: "#64B4C8" }} // screenshot teal color
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">

          {/* LEFT SIDE → LOGO + BRAND NAME */}
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="SkillBridge Logo"
              className="h-12 w-auto" // adjust size if needed
            />
            <span className="text-2xl font-bold" style={{ color: "#183B56" }}>
              SkillBridge
            </span>
          </div>

          {/* CENTER → NAV LINKS */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#home"
              className="font-medium hover:underline"
              style={{ color: "#183B56" }}
            >
              Home
            </a>

            <a
              href="#how-it-works"
              className="font-medium hover:underline"
              style={{ color: "#183B56" }}
            >
              How It Works
            </a>

            <a
              href="#opportunities"
              className="font-medium hover:underline"
              style={{ color: "#183B56" }}
            >
              Opportunities
            </a>

            <a
              href="#features"
              className="font-medium hover:underline"
              style={{ color: "#183B56" }}
            >
              Features
            </a>

            <a
              href="#testimonials"
              className="font-medium hover:underline"
              style={{ color: "#183B56" }}
            >
              Testimonials
            </a>
          </nav>

          {/* RIGHT SIDE → BUTTONS */}
          <div className="flex space-x-4">

            {/* Sign In Button */}
            <Link
              to="/login"
              className="px-4 py-2 border rounded-lg font-medium hover:bg-[#183B56] hover:text-white transition"
              style={{
                color: "#183B56",
                borderColor: "#183B56",
              }}
            >
              Login In
            </Link>

            {/* Get Started Button */}
            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg font-medium text-white transition"
              style={{ backgroundColor: "#FF7A30" }} // orange button
            >
              Get Started
            </Link>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
