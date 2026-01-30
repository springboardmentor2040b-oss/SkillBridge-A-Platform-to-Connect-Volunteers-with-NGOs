import React, { useEffect, useState,  } from "react";
import axios from "axios";
import { useNavigate,  } from "react-router-dom";
import { io } from "socket.io-client";



import {
  FiSearch,
  FiFileText,
  FiLayers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const VolunteerDashboard = () => {
  const navigate = useNavigate();

  const [, setVolunteerName] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const fetchVolunteerProfile = async () => {
  try {
    const res = await axios.get(
      "http://localhost:8000/api/auth/profile",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setVolunteerName(res.data.fullName);
  } catch (err) {
    console.error("Failed to fetch volunteer profile", err);
  }
};

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
        console.error("Failed to fetch stats", err);
      }
    };

    const fetchRecentApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/applications/my-applications",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // latest 3 applications
        setRecentApplications(res.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch applications", err);
      }
    };
    
   
    fetchVolunteerProfile();
    fetchStats();
    fetchRecentApplications();

    // Socket.IO setup
  const socket = io("http://localhost:8000", {
    auth: {
      token: localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket error:", err.message);
  });

  return () => socket.disconnect();


  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9F5F8] to-[#F7FBFC]">
      <main className="p-6 space-y-10 w-full">

        {/* Overview */}
        {/* Dashboard Header */}
        <section className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <h2 className="text-2xl font-bold text-[#1f3a5f]">
            Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Monitor your applications and recent activity
          </p>


          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              {
                label: "Total Applications",
                value: stats.total,
                bg: "from-[#E6F6F9] to-[#F2FBFD]",
                icon: <FiLayers />,
                color: "#1f3a5f",
              },
              {
                label: "Pending",
                value: stats.pending,
                bg: "from-[#FFF1E8] to-[#FFF7F2]",
                icon: <FiClock />,
                color: "#FF7A30",
              },
              {
                label: "Accepted",
                value: stats.accepted,
                bg: "from-[#EAF7F1] to-[#F4FBF7]",
                icon: <FiCheckCircle />,
                color: "#2F8F7A",
              },
              {
                label: "Rejected",
                value: stats.rejected,
                bg: "from-[#F6EAF2] to-[#FBF4F8]",
                icon: <FiXCircle />,
                color: "#9B4F7A",
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

                <h3
                  className="text-3xl font-semibold"
                  style={{ color: card.color }}
                >
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
          onClick={() => navigate("/volunteer/applications")}
          className="text-sm font-semibold text-[#1f3a5f]
          hover:text-slate-500 transition-colors mr-4"
        >
          View all
        </button>
        </div>

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
                    {/* Opportunity Title */}
                    <h2 className="text-[18px] font-semibold text-[#000000] leading-snug">
                      {app.opportunity_id?.title}
                    </h2>

                    {/* NGO Line (single color, calm) */}
                    <p className="text-sm font-semibold text-[#1f3a5f] mt-0.5 tracking-tight">

                      NGO:{" "}
                      {app.opportunity_id?.ngoName ||
                        app.opportunity_id?.createdBy?.fullName}
                    </p>

                    {/* Applied Date (de-emphasized) */}
                    <p className="text-xs text-slate-500 mt-1">
                      Applied on {formatDate(app.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full capitalize font-semibold ${statusStyle}`}
                  >
                    {app.status}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold mb-6 text-[#1f3a5f]">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Browse Opportunities */}
        <button
          onClick={() => navigate("/volunteer/opportunities")}
          className="group rounded-xl p-8
          bg-gradient-to-br from-[#E6F6F9] to-[#F2FBFD]
          shadow-md hover:shadow-xl hover:-translate-y-1
          transition-all flex flex-col items-center justify-center text-center"
        >
          <FiSearch className="text-4xl text-[#1f3a5f] mb-3 group-hover:scale-110 transition" />
          <p className="font-semibold text-slate-800">
            Browse Opportunities
          </p>
        </button>

        {/* My Applications */}
        <button
          onClick={() => navigate("/volunteer/applications")}
          className="group rounded-xl p-8
          bg-gradient-to-br from-[#FFF1E8] to-[#FFF7F2]
          shadow-md hover:shadow-xl hover:-translate-y-1
          transition-all flex flex-col items-center justify-center text-center"
        >
          <FiFileText className="text-4xl text-[#FF7A30] mb-3 group-hover:scale-110 transition" />
          <p className="font-semibold text-slate-800">
            My Applications
          </p>
        </button>
      </div>
        </section>
      </main>
    </div>
  );
};

export default VolunteerDashboard;
