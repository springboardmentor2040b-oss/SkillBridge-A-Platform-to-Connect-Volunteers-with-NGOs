import React from "react";
import { useEffect, useState } from "react";
import { useNavigate,  } from "react-router-dom";
import { FiPlusCircle, FiBriefcase } from "react-icons/fi";
import { FiGrid, FiUsers, FiMessageSquare } from "react-icons/fi";


import axios from "axios";

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

        // take only latest 3
        setRecentApplications(res.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
  fetchRecentApplications();
    fetchActiveOpportunities();
    fetchStats();
  }, []);



  return (
    <div className="min-h-screen bg-[#E9F5F8] items-justify-center p-6">


      {/* Main Content */}
      <main className="flex-1 p-6 space-y-8">
        {/* Overview */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-lg p-4 bg-[#CDECEF] text-center">
              <h3 className="text-2xl font-bold">{activeOpportunities}</h3>
              <p className="text-sm">Active Opportunities</p>
            </div>

            <div className="rounded-lg p-4 bg-[#E1F2E1] text-center">
              <h3 className="text-2xl font-bold">{stats.total}</h3>
              <p className="text-sm">Applications</p>
            </div>

            <div className="rounded-lg p-4 bg-[#E6CFEA] text-center">
              <h3 className="text-2xl font-bold">{stats.accepted}</h3>
              <p className="text-sm">Active Volunteers</p>
            </div>

            <div className="rounded-lg p-4 bg-[#F6E1CC] text-center">
              <h3 className="text-2xl font-bold">{stats.pending}</h3>
              <p className="text-sm">Pending Applications</p>
            </div>
          </div>
        </section>

        {/* Recent Applications */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>

          {recentApplications.length === 0 ? (
            <p className="text-gray-500 text-sm">No applications yet.</p>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium">{app.volunteer_id?.fullName}</p>

                    <p className="text-sm text-gray-500">
                      Applied for: {app.opportunity_id?.title}
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 capitalize">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Quick Actions */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Opportunity */}
            <button
              onClick={() => navigate("/ngo/opportunities/create")}
              className="border rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-md transition  hover:bg-[#1f3a5f] hover:text-white"
            >
              <FiPlusCircle className="text-3xl mb-2 text-[#1f3a5f] hover:bg-[#ffff] " />
              <p>Create New Opportunity</p>
            </button>

            {/* View Opportunities */}
            <button
              onClick={() => navigate("/ngo/opportunities")}
              className="border rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-md transition  hover:bg-[#1f3a5f] hover:text-white"
            >
              <FiBriefcase className="text-3xl mb-2 text-[#1f3a5f] hover:bg-[#ffff]" />
              <p>Opportunities</p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NGODashboard;
