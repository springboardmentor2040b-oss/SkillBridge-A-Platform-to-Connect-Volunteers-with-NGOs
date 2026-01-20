import React, { useEffect, useState,  } from "react";
import axios from "axios";
import { useNavigate,  } from "react-router-dom";
import { io } from "socket.io-client";



import {
  FiGrid,
  FiBriefcase,
  FiUsers,
  FiMessageSquare,
  FiSearch,
  FiFileText,
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

  return (
    <div className="flex bg-[#E9F5F8] min-h-screen">


      {/* Main Content */}
      <main className="flex-1 p-6 space-y-8">
        {/* Overview */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
          <div className="rounded-lg p-4 bg-[#CDECEF] text-center">
            <h3 className="text-2xl font-bold">{stats.total}</h3>
            <p className="text-sm">Total Applications</p>
          </div>

          <div className="rounded-lg p-4 bg-[#F6E1CC] text-center">
            <h3 className="text-2xl font-bold">{stats.pending}</h3>
            <p className="text-sm">Pending</p>
          </div>

          <div className="rounded-lg p-4 bg-[#E1F2E1] text-center">
            <h3 className="text-2xl font-bold">{stats.accepted}</h3>
            <p className="text-sm">Accepted</p>
          </div>

          <div className="rounded-lg p-4 bg-[#E6CFEA] text-center">
            <h3 className="text-2xl font-bold">{stats.rejected}</h3>
            <p className="text-sm">Rejected</p>
          </div>
        </div>
       </section>
        {/* Recent Applications */}
        <section className="bg-white rounded-xl shadow-md p-6 ">
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>

          {recentApplications.length === 0 ? (
            <p className="text-gray-500 text-sm">
              You haven’t applied to any opportunities yet.
            </p>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => {
                const statusStyle =
                  app.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : app.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800";

                return (
                  <div
                    key={app._id}
                    className="border rounded-lg p-4 flex justify-between items-start"
                  >
                    <div>
                      <p className="font-medium">{app.opportunity_id?.title}</p>
                      <p className="text-sm text-gray-500">
                        NGO: {app.opportunity_id?.ngoName || app.opportunity_id?.createdBy?.fullName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Applied on{" "}
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full capitalize ${statusStyle}`}
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
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Browse Opportunities */}
            <button
              onClick={() => navigate("/volunteer/opportunities")}
              className="border rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-md transition"
            >
              <FiSearch className="text-3xl mb-2 text-[#1f3a5f]" />
              <p>Browse Opportunities</p>
            </button>

            {/* My Applications */}
            <button
              onClick={() => navigate("/volunteer/applications")}
              className="border rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-md transition"
            >
              <FiFileText className="text-3xl mb-2 text-[#1f3a5f]" />
              <p>My Applications</p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VolunteerDashboard;
