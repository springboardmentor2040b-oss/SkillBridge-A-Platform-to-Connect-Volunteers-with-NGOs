import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.svg";
import bellIcon from "../../assets/bell.svg";

const NgoNavbar = () => {
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
    : "N";

  return (
    <header className="fixed top-0 w-full z-50 bg-[#7cc9d6] shadow-sm">
      <div className="relative w-full h-14 flex items-center px-6">

        {/* LEFT — Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1"
          >
            <span className="block h-0.5 w-5 bg-[#0f172a]" />
            <span className="block h-0.5 w-5 bg-[#0f172a]" />
            <span className="block h-0.5 w-5 bg-[#0f172a]" />
          </button>

          <img src={logo} alt="SkillBridge" className="h-9" />
        </div>

        {/* CENTER — Nav */}
        <nav className="hidden md:flex items-center gap-12 text-[#0f172a] font-medium absolute left-1/2 -translate-x-1/2">
          <button onClick={() => navigate("/ngo/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/opportunities")}>Opportunities</button>
          <button onClick={() => navigate("/ngo/applications")}>Applications</button>
          <button onClick={() => navigate("/messages")}>Messages</button>
        </nav>

        {/* RIGHT — Actions */}
        <div className="ml-auto flex items-center gap-5 relative">
          <img
            src={bellIcon}
            alt="Notifications"
            className="h-6 w-6 cursor-pointer"
          />

          <div
            onClick={() => setOpen(!open)}
            className="h-9 w-9 rounded-full bg-[#1f3a5f] text-white flex items-center justify-center font-semibold cursor-pointer"
          >
            {initials}
          </div>

          {open && (
            <div className="absolute right-0 top-12 w-40 bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  navigate("/profile/ngo");
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

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#7cc9d6] border-t">
          <nav className="flex flex-col">
            <button onClick={() => navigate("/ngo/dashboard")} className="px-6 py-3 text-left hover:bg-[#6ab8c5]">
              Dashboard
            </button>
            <button onClick={() => navigate("/opportunities")} className="px-6 py-3 text-left hover:bg-[#6ab8c5]">
              Opportunities
            </button>
            <button onClick={() => navigate("/ngo/applications")} className="px-6 py-3 text-left hover:bg-[#6ab8c5]">
              Applications
            </button>
            <button onClick={() => navigate("/messages")} className="px-6 py-3 text-left hover:bg-[#6ab8c5]">
              Messages
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NgoNavbar;
