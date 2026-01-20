import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import bellIcon from "../../assets/bell.svg";
// eslint-disable-next-line no-undef
const role = user?.role?.toLowerCase();

const AppNavbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : user?.username
    ? user.username[0].toUpperCase()
    : "U";

  return (
    <header className="fixed top-0 w-full z-50 bg-[#7cc9d6] shadow-sm">
      <div className="w-full px-4 sm:px-8 h-12 sm:h-14 flex items-center justify-between">
        {/* LEFT: Hamburger (mobile only) + Logo */}
        <div className="flex items-center gap-2  sm:gap-3">
          {/* Hamburger Icon - Mobile Only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1 lg:gap-2 w-5 h-5 justify-center"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-5 bg-[#0f172a] transition-all ${
                mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-5 bg-[#0f172a] transition-all ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-5 bg-[#0f172a] transition-all ${
                mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>

          {/* Logo - Not Clickable - Responsive Size */}
          <div className="flex items-start">
            <img
              src={logo}
              alt="SkillBridge"
              className="h-8 sm:h-10 md:h-12 mb-1 sm:mb-2"
            />
          </div>
        </div>

        {/* CENTER: Menu - Desktop Only */}
        <nav className="hidden md:flex gap-10 text-[#0f172a] font-medium">
          <button
            onClick={() =>
              navigate(
                role === "ngo" ? "/ngo/dashboard" : "/volunteer/dashboard"
              )
            }
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate(
                role === "ngo"
                  ? "/ngo/opportunities"
                  : "/volunteer/opportunities"
              )
            }
          >
            Opportunities
          </button>

          <button
            onClick={() =>
              navigate(
                role === "ngo" ? "/ngo/applications" : "/volunteer/applications"
              )
            }
          >
            Applications
          </button>

          <Link
            to="/messages"
            className="w-full text-left px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            Messages
          </Link>
        </nav>

        {/* RIGHT */}
        <div className="relative flex items-center gap-3 sm:gap-6">
          <button>
            <img
              src={bellIcon}
              alt="Notifications"
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
          </button>

          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1f3a5f] text-white flex items-center justify-center font-semibold cursor-pointer text-sm sm:text-base"
            onClick={() => setOpen(!open)}
          >
            {initials}
          </div>

          {open && (
            <div className="absolute right-0 top-12 sm:top-14 w-40 bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  navigate(
                    user?.role === "NGO" ? "/profile/ngo" : "/profile/volunteer"
                  );
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm"
              >
                Profile
              </button>

              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-red-600 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#7cc9d6] border-t border-[#6ab8c5]">
          <nav className="flex flex-col">
            <button
              onClick={() => {
                navigate(
                  role === "ngo" ? "/ngo/dashboard" : "/volunteer/dashboard"
                );
                setMobileMenuOpen(false);
              }}
              className="text-left px-4 sm:px-8 py-2.5 sm:py-3 text-[#0f172a] font-medium hover:bg-[#6ab8c5] transition text-sm sm:text-base"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate(
                  role === "ngo"
                    ? "/ngo/opportunities"
                    : "/volunteer/opportunities"
                );

                setMobileMenuOpen(false);
              }}
              className="text-left px-4 sm:px-8 py-2.5 sm:py-3 text-[#0f172a] font-medium hover:bg-[#6ab8c5] transition text-sm sm:text-base"
            >
              Opportunities
            </button>
            <button
              onClick={() => {
                navigate(
                  role === "ngo" ? "/applications" : "/volunteer/applications"
                );

                setMobileMenuOpen(false);
              }}
              className="text-left px-4 sm:px-8 py-2.5 sm:py-3 text-[#0f172a] font-medium hover:bg-[#6ab8c5] transition text-sm sm:text-base"
            >
              Applications
            </button>
            <button
              onClick={() => {
                navigate(role === "ngo" ? "/messages" : "/volunteer/messages");

                setMobileMenuOpen(false);
              }}
              className="text-left px-4 sm:px-8 py-2.5 sm:py-3 text-[#0f172a] font-medium hover:bg-[#6ab8c5] transition text-sm sm:text-base"
            >
              Messages
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AppNavbar;
