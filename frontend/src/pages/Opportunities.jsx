import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";
import { getAllOpportunities, applyForOpportunity } from "../services/api";

/* ✅ DEMO DATA (UNCHANGED) */
const demoOpportunities = [
  {
    _id: "demo1",
    title: "Frontend Developer",
    description: "Build UI components using React",
    required_skills: ["Java", "Python"],
    location: "Delhi",
    duration: "1 month",
    status: "open",
    ngo_id: { organization_name: "Helping Hands NGO" },
    createdAt: "2026-01-10",
  },
];

export default function Opportunities() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  /* 🔹 NEW: modal state */
  const [selectedOpp, setSelectedOpp] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await getAllOpportunities();
        const backendOpps = res.data?.opportunities || [];
        setOpportunities(
          backendOpps.length > 0 ? backendOpps : demoOpportunities
        );
      } catch {
        setOpportunities(demoOpportunities);
      }
    };

    fetchOpportunities();
  }, []);

  const handleApply = async (id) => {
    try {
      setLoadingId(id);
      await applyForOpportunity(id);
      alert("Application submitted successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAV – UNCHANGED */}
      {/* TOP NAV */}
      <header className="bg-blue-600 text-white">
        <div className="px-8 py-4 flex items-center gap-6">
          <Logo size={32} textColor="white" />

          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </span>

          <span className="font-semibold underline">Opportunities</span>

          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/applications")}
          >
            Applications
          </span>

          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/messages")}
          >
            Messages
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">All Opportunities</h1>
        <p className="text-gray-600 mb-6">
          Explore volunteering opportunities across NGOs
        </p>

        <div className="space-y-5">
          {opportunities.map((opp) => (
            <div key={opp._id} className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold">{opp.title}</h3>
              <p className="text-gray-600 mt-1">{opp.description}</p>

              <div className="flex gap-2 mt-3 flex-wrap">
                {(opp.required_skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="text-sm text-gray-500 mt-3">
                🏢 {opp.ngo_id?.organization_name} • 📍 {opp.location} • ⏳{" "}
                {opp.duration}
              </div>

              <div className="flex gap-3 mt-4">
                {/* ✅ NEW: View Details */}
                <button
                  onClick={() => setSelectedOpp(opp)}
                  className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  View Details
                </button>

                <button
                  onClick={() => handleApply(opp._id)}
                  disabled={loadingId === opp._id}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {loadingId === opp._id ? "Applying..." : "Apply"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ================= VIEW DETAILS MODAL ================= */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">
            <button
              onClick={() => setSelectedOpp(null)}
              className="absolute top-3 right-4 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-2">{selectedOpp.title}</h2>

            <p className="text-gray-700 mb-3">{selectedOpp.description}</p>

            <div className="space-y-2 text-sm">
              <p>
                <strong>NGO:</strong> {selectedOpp.ngo_id?.organization_name}
              </p>
              <p>
                <strong>Location:</strong> {selectedOpp.location}
              </p>
              <p>
                <strong>Duration:</strong> {selectedOpp.duration}
              </p>
              <p>
                <strong>Status:</strong> {selectedOpp.status}
              </p>
              <p>
                <strong>Skills Required:</strong>{" "}
                {(selectedOpp.required_skills || []).join(", ")}
              </p>
              {selectedOpp.createdAt && (
                <p>
                  <strong>Posted on:</strong>{" "}
                  {new Date(selectedOpp.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
