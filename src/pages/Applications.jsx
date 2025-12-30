import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";

export default function Applications() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userProfile"));
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(stored);
  }, []);

  // 🔹 Role-based filtering (CORE LOGIC)
  const visibleApplications = applications.filter((app) => {
    if (user.role === "volunteer") {
      return app.applicantName === user.name;
    }

    if (user.role === "ngo") {
      return app.ngoName === user.name;
    }

    return false;
  });

  // 🔹 Status + search filter
  const filteredApplications = visibleApplications.filter((app) => {
    const statusMatch =
      filter === "All" || app.status.toLowerCase() === filter.toLowerCase();
    const searchMatch =
      app.applicantName?.toLowerCase().includes(search.toLowerCase()) ||
      app.opportunityTitle?.toLowerCase().includes(search.toLowerCase());

    return statusMatch && searchMatch;
  });

  // 🔹 Count helpers
  const countByStatus = (status) =>
    visibleApplications.filter(
      (a) => a.status.toLowerCase() === status.toLowerCase()
    ).length;

  // 🔹 NGO actions
  const updateStatus = (id, status) => {
    const updated = applications.map((app) =>
      app.id === id ? { ...app, status } : app
    );
    setApplications(updated);
    localStorage.setItem("applications", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔵 NAVBAR */}
      <header className="bg-white border-b">
        <div className="px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Logo size={34} textColor="#2563eb" />
            <nav className="hidden md:flex gap-6 text-gray-700">
              <span onClick={() => navigate("/dashboard")} className="cursor-pointer hover:text-blue-600">
                Dashboard
              </span>
              <span onClick={() => navigate("/opportunities")} className="cursor-pointer hover:text-blue-600">
                Opportunities
              </span>
              <span className="font-semibold text-blue-600">
                Applications
              </span>
              <span className="cursor-pointer hover:text-blue-600">
                Messages
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm capitalize">
              {user.role}
            </span>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">
          {user.role === "volunteer" ? "My Applications" : "Applications"}
        </h1>
        <p className="text-gray-600 mb-6">
          {user.role === "volunteer"
            ? "Track the opportunities you have applied for"
            : "Manage applications for your opportunities"}
        </p>

        {/* SEARCH + FILTER */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center mb-6">
          <input
            type="text"
            placeholder={
              user.role === "volunteer"
                ? "Search opportunities..."
                : "Search applicants..."
            }
            className="w-full md:flex-1 border px-4 py-2 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-4 py-2 rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* STATUS TABS */}
        <div className="flex gap-6 mb-6 text-sm">
          <span onClick={() => setFilter("All")} className={`cursor-pointer ${filter === "All" && "font-semibold text-blue-600"}`}>
            All ({visibleApplications.length})
          </span>
          <span onClick={() => setFilter("Pending")} className={`cursor-pointer ${filter === "Pending" && "font-semibold text-yellow-600"}`}>
            Pending ({countByStatus("Pending")})
          </span>
          <span onClick={() => setFilter("Accepted")} className={`cursor-pointer ${filter === "Accepted" && "font-semibold text-green-600"}`}>
            Accepted ({countByStatus("Accepted")})
          </span>
          <span onClick={() => setFilter("Rejected")} className={`cursor-pointer ${filter === "Rejected" && "font-semibold text-red-600"}`}>
            Rejected ({countByStatus("Rejected")})
          </span>
        </div>

        {/* APPLICATION CARDS */}
        <div className="space-y-6">
          {filteredApplications.length === 0 && (
            <p className="text-gray-500">No applications found.</p>
          )}

          {filteredApplications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {app.opportunityTitle}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {user.role === "ngo"
                      ? `${app.applicantName} • Applied on ${app.appliedAt}`
                      : `Applied on ${app.appliedAt}`}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    app.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : app.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <p className="text-gray-700 mt-4">
                {app.message}
              </p>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3 mt-6 items-center">
                {user.role === "ngo" && app.status === "Pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(app.id, "Accepted")}
                      className="text-sm bg-green-600 text-white px-4 py-1 rounded-lg"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "Rejected")}
                      className="text-sm bg-red-500 text-white px-4 py-1 rounded-lg"
                    >
                      Reject
                    </button>
                  </>
                )}

                <button className="ml-auto text-sm border px-4 py-1 rounded-lg">
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
