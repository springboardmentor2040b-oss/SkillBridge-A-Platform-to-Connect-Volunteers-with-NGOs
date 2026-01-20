import React, { useEffect, useState } from "react";
import { Logo } from "../components";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", role: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-10">
          <Logo size={40} textColor="#2563eb" />
        </div>

        <nav className="flex-1">
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center gap-3 text-blue-600 font-medium">
              📊 Dashboard
            </li>

            <li
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate("/opportunities")}
            >
              💼 Opportunities
            </li>

            <li
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate("/applications")}
            >
              📄 Applications
            </li>

            <li
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate("/messages")}
            >
              💬 Messages
            </li>

            <li
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate("/profile")}
            >
              ⚙️ Settings
            </li>
          </ul>
        </nav>

        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} SkillBridge
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">
            {user.role === "ngo" ? "NGO Dashboard" : "Volunteer Dashboard"}
          </h2>

          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <span>{user.name || "User"}</span>
            <UserCircleIcon className="w-8 h-8 text-gray-600" />
          </div>
        </header>

        {/* OVERVIEW */}
        <section className="mb-8">
          <h3 className="text-lg font-medium mb-4">Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold">3</div>
              <div className="text-gray-600 text-sm mt-2">
                Active Opportunities
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold">4</div>
              <div className="text-gray-600 text-sm mt-2">
                Applications
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold">12</div>
              <div className="text-gray-600 text-sm mt-2">
                Active Volunteers
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold">2</div>
              <div className="text-gray-600 text-sm mt-2">
                Active Applications
              </div>
            </div>
          </div>
        </section>

        {/* RECENT APPLICATIONS */}
        <section className="mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="font-medium mb-4">Recent Applications</h4>

            <div className="space-y-4">
              <div className="flex justify-between items-center border rounded-lg p-4">
                <div>
                  <div className="font-semibold">Frontend Developer</div>
                  <div className="text-sm text-gray-500">
                    Helping Hands NGO
                  </div>
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                  Accepted
                </span>
              </div>

              <div className="flex justify-between items-center border rounded-lg p-4">
                <div>
                  <div className="font-semibold">Backend Developer</div>
                  <div className="text-sm text-gray-500">
                    Code For Cause
                  </div>
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
                  Pending
                </span>
              </div>

              <div className="flex justify-between items-center border rounded-lg p-4">
                <div>
                  <div className="font-semibold">Social Media Manager</div>
                  <div className="text-sm text-gray-500">
                    Green Earth Foundation
                  </div>
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">
                  Rejected
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section>
          <h4 className="text-lg font-medium mb-4">Quick Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.role === "ngo" && (
              <div
                className="bg-white p-8 rounded-xl shadow-sm text-center cursor-pointer hover:shadow-md"
                onClick={() => navigate("/create-opportunity")}
              >
                <div className="text-blue-600 text-3xl mb-3">＋</div>
                <div className="text-blue-600 font-medium">
                  Create New Opportunity
                </div>
              </div>
            )}

            <div
              className="bg-white p-8 rounded-xl shadow-sm text-center cursor-pointer hover:shadow-md"
              onClick={() => navigate("/messages")}
            >
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
