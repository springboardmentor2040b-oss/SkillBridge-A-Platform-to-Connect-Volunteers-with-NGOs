import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    navigate("/login");
  };

  return (
    <div className="relative" ref={ref}>
      {/* Profile trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3"
      >
        <span className="text-gray-700 font-medium">{user.name}</span>

        <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-white">
          <UserCircleIcon className="w-6 h-6 text-gray-600" />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border z-50">
          {/* Header */}
          <div className="px-5 py-4 border-b">
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500 capitalize">
              {user.role}
            </p>
          </div>

          {/* Actions */}
          <button
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="w-full text-left px-5 py-3 hover:bg-gray-100 text-gray-700"
          >
            Account Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-600 font-semibold rounded-b-xl"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
