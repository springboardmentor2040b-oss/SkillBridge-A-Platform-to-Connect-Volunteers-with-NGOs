import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentHash = location.hash || "#home";

  const [menuOpen, setMenuOpen] = useState(false);

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

  const chipStyle = (hash) =>
    `px-5 py-1.5 text-sm rounded-full transition whitespace-nowrap ${
      currentHash === hash
        ? "bg-[#1f3a5f] text-white shadow-sm"
        : "text-[#0f172a] hover:bg-white/30"
    }`;

  const mobileLinkStyle = (hash) =>
    `relative flex items-center gap-3 py-2 text-sm font-medium transition ${
      currentHash === hash ? "text-white" : "text-sm-[#183B56]"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full bg-[#64B4C8] shadow-md z-50">
      
      {/* NAV BAR */}
      <div className="h-14">
        <div className="w-full h-full px-6 flex items-center justify-between">

          {/* LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="lg:hidden text-[#183B56]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo */}
            <img
              src={logo}
              alt="SkillBridge"
              className="h-9"
              draggable="false"
            />
          </div>

          {/* CENTER NAV — DESKTOP ONLY */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 font-semibold">
            <a href="#home" className={chipStyle("#home")}>Home</a>
            <a href="#how-it-works" className={chipStyle("#how-it-works")}>How It Works</a>
            <a href="#opportunities" className={chipStyle("#opportunities")}>Opportunities</a>
            <a href="#testimonials" className={chipStyle("#testimonials")}>Testimonials</a>
            <a href="#features" className={chipStyle("#features")}>Features</a>
          </nav>

          {/* RIGHT ACTIONS — ALWAYS TOP RIGHT */}
          {userEmail ? (
            <div className="flex items-center space-x-4">
              <span className="text-[#183B56] font-medium hidden sm:block">
                Welcome, {userEmail}
              </span>
              <button
                onClick={logout}
                className="px-4 py-1.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/login"
                className="px-4 py-1.5 border border-[#183B56] text-sm-[#183B56] rounded-lg text-sm hover:bg-[#183B56] hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-1.5 rounded-lg text-white text-sm bg-[#FF7A30]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DROPDOWN — VERTICAL ONLY */}
      {menuOpen && (
        <div className="lg:hidden bg-[#64B4C8]/95 backdrop-blur shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
            {[
              ["Home", "#home"],
              ["How It Works", "#how-it-works"],
              ["Opportunities", "#opportunities"],
              ["Testimonials", "#testimonials"],
              ["Features", "#features"],
            ].map(([label, hash]) => (
              <a
                key={hash}
                href={hash}
                onClick={() => setMenuOpen(false)}
                className={mobileLinkStyle(hash)}
              >
                {currentHash === hash && (
                  <span className="w-1 h-4 bg-[#1f3a5f] rounded" />
                )}
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
