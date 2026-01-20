import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import useChat from "../../context/useChat";
import logo from "../../assets/logo.svg";
import bellIcon from "../../assets/bell.svg";


const VolunteerNavbar = () => {
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
    : "V";

  const location = useLocation();
  const currentPath = location.pathname;
  const { conversations } = useChat();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id;

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCounts?.[currentUserId] || 0),
    0
  );

  return (
    <header className="fixed top-0 w-full z-50 bg-[#7cc9d6] shadow-sm">
      <div className="relative w-full h-14 flex items-center px-6">
        {/* LEFT — Logo */}
        <div className="flex items-center gap-3 min-w-[220px]">
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

        {/* CENTER — Navigation */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 font-semibold">
          {/* Dashboard */}
          <Link
            to="/volunteer/dashboard"
            className={`px-4 py-1.5 text-sm rounded-full transition ${
              currentPath === "/volunteer/dashboard"
                ? "bg-[#1f3a5f] text-white shadow-sm"
                : "text-[#0f172a] hover:bg-white/30"
            }`}
          >
            Dashboard
          </Link>

          {/* Opportunities */}
          <Link
            to="/volunteer/opportunities"
            className={`px-4 py-1.5 text-sm rounded-full transition ${
              currentPath === "/volunteer/opportunities"
                ? "bg-[#1f3a5f] text-white shadow-sm"
                : "text-[#0f172a] hover:bg-white/30"
            }`}
          >
            Opportunities
          </Link>

          {/* Applications */}
          <Link
            to="/volunteer/applications"
            className={`px-4 py-1.5 text-sm rounded-full transition ${
              currentPath === "/volunteer/applications"
                ? "bg-[#1f3a5f] text-white shadow-sm"
                : "text-[#0f172a] hover:bg-white/30"
            }`}
          >
            Applications
          </Link>

          {/* Messages */}
          <Link
            to="/volunteer/messages"
            className={`px-4 py-1.5 text-sm rounded-full transition ${
              currentPath === "/volunteer/messages"
                ? "bg-[#1f3a5f] text-white shadow-sm"
                : "text-[#0f172a] hover:bg-white/30"
            }`}
          >
            Messages
          </Link>
        </nav>

        {/* RIGHT — Notifications & Profile */}
        <div className="ml-auto flex items-center gap-5 relative">
          <div style={{ position: "relative", cursor: "pointer" }}
          onClick={() => navigate("/volunteer/messages")}>
            <img
              src={bellIcon}
              alt="Notifications"
              className="h-6 w-6 cursor-pointer"
            />
            {totalUnread > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  backgroundColor: "#facc15", // yellow
                  color: "#000",
                  borderRadius: "50%",
                  fontSize: "10px",
                  minWidth: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                }}
              >
                {totalUnread}
              </span>
            )}
          </div>

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
                  navigate("/profile/volunteer");
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
            <button
              onClick={() => navigate("/volunteer/dashboard")}
              className="px-6 py-3 text-left hover:bg-[#6ab8c5]"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/volunteer/opportunities")}
              className="px-6 py-3 text-left hover:bg-[#6ab8c5]"
            >
              Opportunities
            </button>

            <button
              onClick={() => navigate("/volunteer/applications")}
              className="px-6 py-3 text-left hover:bg-[#6ab8c5]"
            >
              Applications
            </button>

            <button
              onClick={() => navigate("/volunteer/messages")}
              className="px-6 py-3 text-left hover:bg-[#6ab8c5]"
            >
              Messages
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default VolunteerNavbar;
