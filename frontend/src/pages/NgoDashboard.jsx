import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiPlusCircle,
  FiBriefcase,
  FiLayers,
  FiUsers,
  FiClock,
} from "react-icons/fi";

const NGODashboard = () => {
  const navigate = useNavigate();

  const [activeOpportunities, setActiveOpportunities] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/applications/stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchActiveOpportunities = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/opportunities/ngo/active-count",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setActiveOpportunities(res.data.activeOpportunities);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchRecentApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/applications/ngo-applications",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRecentApplications(res.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
    fetchActiveOpportunities();
    fetchRecentApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9F5F8] to-[#F7FBFC]">
      <main className="p-6 space-y-10 w-full">

        {/* Overview */}
                <section className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <h2 className="text-2xl font-bold text-[#1f3a5f]">
            Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Manage opportunities, applications, and volunteer engagement at a glance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              {
                label: "Active Opportunities",
                value: activeOpportunities,
                bg: "from-[#E6F6F9] to-[#F2FBFD]",
                icon: <FiBriefcase />,
                color: "#1f3a5f",
              },
              {
                label: "Applications",
                value: stats.total,
                bg: "from-[#EAF7F1] to-[#F4FBF7]",
                icon: <FiLayers />,
                color: "#2F8F7A",
              },
              {
                label: "Active Volunteers",
                value: stats.accepted,
                bg: "from-[#F6EAF2] to-[#FBF4F8]",
                icon: <FiUsers />,
                color: "#9B4F7A",
              },
              {
                label: "Pending Applications",
                value: stats.pending,
                bg: "from-[#FFF1E8] to-[#FFF7F2]",
                icon: <FiClock />,
                color: "#FF7A30",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`relative rounded-xl p-5 bg-gradient-to-br ${card.bg}
                shadow-[0_6px_16px_rgba(0,0,0,0.08)]
                hover:shadow-[0_20px_40px_rgba(0,0,0,0.14)]
                hover:-translate-y-1 transition-all duration-300`}
              >
                <div
                  className="absolute top-4 right-4 text-xl opacity-80"
                  style={{ color: card.color }}
                >
                  {card.icon}
                </div>

                <h3 className="text-3xl font-semibold" style={{ color: card.color }}>
                  {card.value}
                </h3>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  {card.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Applications */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1f3a5f]">
            Recent Applications
          </h2>

        <button
          onClick={() => navigate("/ngo/applications")}
          className="text-sm font-semibold text-[#1f3a5f]
          hover:text-slate-500 transition-colors mr-4"
        >
          View all
        </button>
        </div>

          {recentApplications.length === 0 ? (
            <p className="text-slate-500 text-sm">No applications yet.</p>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => {
                const statusStyle =
                  app.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : app.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : app.status === "withdrawn"
                    ? "bg-slate-200 text-slate-700"
                    : "bg-red-100 text-red-800";

                return (
                  <div
                    key={app._id}
                    className="flex justify-between items-start p-4 rounded-xl
                    border border-slate-100 bg-white
                    hover:shadow-md hover:-translate-y-[2px]
                    transition-all duration-200"
                  >
                    <div>
                      <h2 className="text-[18px] font-semibold text-black">
                        {app.volunteer_id?.fullName}
                      </h2>
                      <p className="text-sm font-semibold text-gray-600 mt-0.5">
                        Applied for: {app.opportunity_id?.title}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1.5 rounded-full capitalize font-semibold
                      ${statusStyle}`}
                    >
                      {app.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold mb-6 text-[#1f3a5f]">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate("/ngo/opportunities/create")}
              className="group rounded-xl p-8
              bg-gradient-to-br from-[#E6F6F9] to-[#F2FBFD]
              shadow-md hover:shadow-xl hover:-translate-y-1
              transition-all flex flex-col items-center justify-center text-center"
            >
              <FiPlusCircle className="text-4xl text-[#1f3a5f] mb-3 group-hover:scale-110 transition" />
              <p className="font-semibold text-slate-800">
                Create New Opportunity
              </p>
            </button>

            <button
              onClick={() => navigate("/ngo/opportunities")}
              className="group rounded-xl p-8
              bg-gradient-to-br from-[#FFF1E8] to-[#FFF7F2]
              shadow-md hover:shadow-xl hover:-translate-y-1
              transition-all flex flex-col items-center justify-center text-center"
            >
              <FiBriefcase className="text-4xl text-[#FF7A30] mb-3 group-hover:scale-110 transition" />
              <p className="font-semibold text-slate-800">
                View Opportunities
              </p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NGODashboard;
