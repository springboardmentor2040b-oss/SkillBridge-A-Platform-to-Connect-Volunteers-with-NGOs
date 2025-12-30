import React, { useEffect, useState } from "react";
import { Logo } from "../components";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // ✅ NEW: user state
  const [user, setUser] = useState({ name: "" });
  const [userRole, setUserRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ NEW: get user data from signup (localStorage)
  useEffect(() => {
  const storedUser = localStorage.getItem("userProfile");

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);

    setUser(parsedUser);          // 👈 existing line
    setUserRole(parsedUser.role); // 👈 ADD THIS LINE (AFTER setUser)
  }
}, []);


  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r p-6 flex-col gap-6 transform
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300
          md:translate-x-0 md:flex`}
      >

        <div className="flex items-center gap-3 mb-10">
          <Logo size={40} textColor="#2563eb" />
        </div>
        <button
          className="md:hidden mb-6 text-xl"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>


        <nav className="flex-1">
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center gap-3 text-blue-600">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                ▶
              </div>
              <span className="font-medium">Dashboard</span>
            </li>

            <li
               className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-blue-600"
               onClick={() => {
                 if (userRole === "ngo") {
                  navigate("/ngo-opportunities");
                } else if(userRole ==="volunteer"){
                  navigate("/volunteer-opportunities"); // volunteer (view only – later)
                }
              }}
            >
              <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                  ☐
              </div>
              <span>Opportunities</span>
            </li>
            <li
              className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-blue-600"
              onClick={() => navigate("/applications")}
            >
              <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                📄
              </div>
              <span>Applications</span>
            </li>


            <li className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                💬
              </div>
              <span>Messages</span>
            </li>

            <li
              className="flex items-center gap-3 text-gray-600 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                ⚙️
              </div>
              <span>Settings</span>
            </li>
          </ul>
        </nav>

        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} SkillBridge
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">

            {/* ☰ Hamburger menu – only small screens */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>

            <h2 className="text-xl font-semibold capitalize">
              {userRole || "Dashboard"}
            </h2>
          </div>


          {/* ✅ UPDATED: dynamic user name + clickable profile */}
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <span className="text-gray-700">
              {user.name || "User"}
            </span>

            <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-white">
              <UserCircleIcon className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </header>

        {/* Overview */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-4">Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-pink-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold">3</div>
              <div className="text-sm text-gray-600 mt-2">
                Active opportunities
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold">1</div>
              <div className="text-sm text-gray-600 mt-2">
                Applications
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm text-gray-600 mt-2">
                Active Volunteers
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold">1</div>
              <div className="text-sm text-gray-600 mt-2">
                Active Applications
              </div>
            </div>
          </div>
        </section>

        {/* Recent Applications */}
        <section className="mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Recent Applications</h4>
              <div className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                Pending
              </div>
            </div>

            <div className="mt-2 border rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  👤
                </div>
                <div className="flex-1">
                  <div className="font-semibold">John Doe</div>
                  <div className="text-xs text-gray-500">
                    Applied for website redesign work
                  </div>
                  <p className="mt-2 text-gray-700">
                    I have 5 years of experience in web development and design.
                    I have worked with several non-profits before and would love
                    to improve your online presence.
                  </p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Pending
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h4 className="text-lg font-medium mb-4">Quick Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userRole === "ngo" && (
              <div
                onClick={() => navigate("/create-opportunity")}
                className="bg-white rounded-xl p-8 shadow-sm text-center cursor-pointer hover:shadow-md"
              >
                <div className="text-blue-600 text-3xl mb-3">+</div>
                <div className="text-blue-600 font-medium">
                Create New Opportunity
              </div>
             </div>
            )}

            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="text-blue-600 text-3xl mb-3">💬</div>
              <div className="text-blue-600 font-medium">
                View Messages
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
