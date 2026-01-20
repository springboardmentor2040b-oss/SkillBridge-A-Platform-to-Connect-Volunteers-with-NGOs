import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ GUARD: user not loaded yet
  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* Profile button */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span className="text-gray-700 font-medium">
          {user.name}
        </span>

        <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-white">
          <UserCircleIcon className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 border-b">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500 capitalize">
              {user.role}
            </p>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Account Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
