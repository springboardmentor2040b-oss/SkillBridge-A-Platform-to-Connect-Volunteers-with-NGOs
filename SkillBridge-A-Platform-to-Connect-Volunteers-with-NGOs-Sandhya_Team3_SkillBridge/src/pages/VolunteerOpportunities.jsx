// src/pages/VolunteerOpportunities.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";
import OpportunityPage from "../components/OpportunityPage";

export default function VolunteerOpportunities() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAV – SAME BLUE STYLE */}
      <header className="bg-blue-600 text-white">
        <div className="px-8 py-4 flex justify-between items-center">

          {/* LEFT */}
          <div className="flex items-center gap-6">
            {/* ☰ Hamburger – small screens only */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            <Logo size={32} textColor="white" />

            {/* Desktop Nav – SAME STYLE */}
            <div className="hidden md:flex items-center gap-6">
              <span
                className="cursor-pointer hover:text-blue-200"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </span>

              <span className="font-semibold">
                Opportunities
              </span>

              <span
                className="cursor-pointer hover:text-blue-200"
                onClick={() => navigate("/applications")}
              >
                Applications
              </span>

              <span
                className="cursor-pointer hover:text-blue-200"
                onClick={() => navigate("/messages")}
              >
                Messages
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <span className="bg-blue-800 px-3 py-1 rounded-full text-sm">
            Volunteer
          </span>
        </div>

        {/* MOBILE MENU – SAME BLUE STYLE */}
        {menuOpen && (
          <div className="md:hidden bg-blue-600 border-t border-blue-500 px-8 py-3 space-y-3">
            <div
              className="cursor-pointer hover:text-blue-200"
              onClick={() => {
                navigate("/dashboard");
                setMenuOpen(false);
              }}
            >
              Dashboard
            </div>

            <div
              className="cursor-pointer hover:text-blue-200"
              onClick={() => setMenuOpen(false)}
            >
              Opportunities
            </div>

            <div
              className="cursor-pointer hover:text-blue-200"
              onClick={() => {
                navigate("/applications");
                setMenuOpen(false);
              }}
            >
              Applications
            </div>

            <div
              className="cursor-pointer hover:text-blue-200"
              onClick={() => {
                navigate("/messages");
                setMenuOpen(false);
              }}
            >
              Messages
            </div>
          </div>
        )}
      </header>

      {/* PAGE CONTENT */}
      <OpportunityPage />

    </div>
  );
}
