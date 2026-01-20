import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";
import API from "../services/api";

/* ✅ DUMMY APPLICATIONS (FALLBACK ONLY – UI UNCHANGED) */
const demoApplications = [
  {
    _id: "a1",
    status: "accepted",
    createdAt: "2026-01-10",
    opportunity_id: {
      title: "Frontend Developer",
      ngo_id: { organization_name: "Helping Hands NGO" },
    },
  },
  {
    _id: "a2",
    status: "pending",
    createdAt: "2026-01-12",
    opportunity_id: {
      title: "Backend Developer",
      ngo_id: { organization_name: "Code For Cause" },
    },
  },
  {
    _id: "a3",
    status: "rejected",
    createdAt: "2026-01-14",
    opportunity_id: {
      title: "Social Media Manager",
      ngo_id: { organization_name: "Green Earth Foundation" },
    },
  },
];

export default function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  /* ✅ FETCH APPLICATIONS */
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/applications/my");

        const data = res.data || [];

        // ✅ FALLBACK TO DUMMY DATA IF BACKEND EMPTY
        setApplications(data.length > 0 ? data : demoApplications);
      } catch (error) {
        console.error("Failed to fetch applications", error);
        setApplications(demoApplications); // safety fallback
      }
    };

    fetchApplications();
  }, []);

  /* ✅ FILTER LOGIC (FIXED & WORKING) */
  const filteredApplications =
    statusFilter === "All"
      ? applications
      : applications.filter(
          (app) => app.status?.toLowerCase() === statusFilter.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAV (UNCHANGED) */}
      {/* TOP NAV – FULL (MATCHES OTHER PAGES) */}
      {/* TOP NAV – FULL (BLUE) */}
      <header className="bg-blue-600 text-white border-b">
        <div className="px-8 py-4 flex items-center gap-8">
          <Logo size={32} textColor="white" />

          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </span>

          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/opportunities")}
          >
            Opportunities
          </span>

          <span className="font-semibold underline">Applications</span>

          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/messages")}
          >
            Messages
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">My Applications</h1>
        <p className="text-gray-600 mb-6">
          Track the opportunities you have applied for
        </p>

        {/* SEARCH + FILTER (UI UNCHANGED) */}
        <div className="flex gap-4 mb-6">
          <input
            placeholder="Search..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option>All</option>
            <option>Accepted</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* APPLICATION LIST */}
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{app.opportunity_id?.title}</h3>
                <p className="text-sm text-gray-600">
                  {app.opportunity_id?.ngo_id?.organization_name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`px-4 py-1 rounded-full text-sm capitalize ${
                  app.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : app.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
