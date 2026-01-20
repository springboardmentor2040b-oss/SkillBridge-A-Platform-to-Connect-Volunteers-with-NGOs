import React, { useEffect, useState } from "react";
import { Logo } from "../components";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "../components/ProfileDropdown";


export default function Dashboard() {
  const navigate = useNavigate();

  // ✅ NEW: user state
  
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);

  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ NEW: get user data from signup (localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser=JSON.parse(storedUser);
    setUser(parsedUser);
    const storedApplications =
    JSON.parse(localStorage.getItem("applications")) || [];

    setApplications(storedApplications);
  }, [navigate]);
  if (!user) return null; // safety
    // 🔹 Filter applications based on role
    const myApplications =
      user.role === "volunteer"
        ? applications.filter(app => app.applicantName === user.name)
        : applications.filter(app => app.ngoName === user.name);

    // 🔹 Status counts
    const acceptedCount = myApplications.filter(
      app => app.status === "Accepted"
    ).length;

    const pendingCount = myApplications.filter(
      app => app.status === "Pending"
    ).length;

    // 🔹 Most recent application
    const recentApplication =
      myApplications.length > 0
        ? myApplications[myApplications.length - 1]
        : null;

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
                 if (user?.role === "ngo") {
                    navigate("/ngo-opportunities");
                  } else {
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


            <li className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-blue-600"
                onClick={() => navigate("/messages")}
            >
              <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                💬
              </div>
              <span>Messages</span>
            </li>

            <li
              className="flex items-center gap-3 text-gray-600 cursor-pointer"
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
              {user?.role || "Dashboard"}
            </h2>
          </div>


          <div className="flex items-center gap-4">
            <ProfileDropdown user={user} />
          </div>

        </header>

        {/* Overview */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-4">Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-pink-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold">
                {user.role === "ngo" ? "—" : myApplications.length}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {user.role === "ngo" ? "Active Opportunities" : "Applied Opportunities"}
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold">
                {myApplications.length}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Applications
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold">
                {acceptedCount}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Accepted Applications
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold">
                {pendingCount}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Pending Applications
              </div>
            </div>
          </div>
        </section>

        {/* Recent Applications */}
        <section className="mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Recent Applications</h4>
              {recentApplication && (
                <div className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                  {recentApplication.status}
                </div>
              )}
            </div>

            {!recentApplication ? (
              <p className="text-gray-500 text-sm">
                No applications yet.
              </p>
            ) : (
              <div className="mt-2 border rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    👤
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold">
                      {user.role === "ngo"
                        ? recentApplication.applicantName
                        : recentApplication.ngoName}
                    </div>

                    <div className="text-xs text-gray-500">
                      Applied for {recentApplication.opportunityTitle}
                    </div>

                    <p className="mt-2 text-gray-700">
                      {recentApplication.message}
                    </p>
                  </div>

                  <div
                    className={`text-sm px-3 py-1 rounded-full ${
                      recentApplication.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : recentApplication.status === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {recentApplication.status}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

          

        {/* Quick actions */}
        <section>
          <h4 className="text-lg font-medium mb-4">Quick Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user?.role === "ngo" && (
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
