// src/pages/Opportunities.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";

export default function Opportunities() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const storedOpps = localStorage.getItem("ngoOpportunities");
    if (storedOpps) {
      setOpportunities(JSON.parse(storedOpps));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
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
          <span className="font-semibold">Opportunities</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">All Opportunities</h1>
        <p className="text-gray-600 mb-6">
          Explore volunteering opportunities across NGOs
        </p>

        <div className="space-y-5">
          {opportunities.length === 0 && (
            <p className="text-gray-500">No opportunities available.</p>
          )}

          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{opp.title}</h3>
              <p className="text-gray-600 mt-1">{opp.description}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {opp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="text-sm text-gray-500 mt-3">
                🏢 {opp.ngoName} • 📍 {opp.location} • ⏳ {opp.duration}
              </div>

              <button
                className="mt-4 text-blue-600 font-medium hover:underline"
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
