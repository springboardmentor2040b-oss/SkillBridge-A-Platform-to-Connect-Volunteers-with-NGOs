import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = ({ fullName }) => {
  const navigate = useNavigate();

  const [dashboardError, setDashboardError] = useState("");
  const [actionError, setActionError] = useState("");
  const [stats, setStats] = useState({
    activeOpportunities: 0,
    applications: 0,
    activeVolunteers: 0,
    pendingApplications: 0,
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.userType?.trim().toUpperCase();

  // Load dashboard stats
  useEffect(() => {
    if (!token || !user) {
      setDashboardError("Please login to access dashboard.");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/opportunities",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const opportunities = Array.isArray(response.data)
          ? response.data
          : [];

        const activeOpps = opportunities.filter(
          (opp) => opp.status === "OPEN"
        ).length;

        setStats({
          activeOpportunities: activeOpps,
          applications: 0,
          activeVolunteers: 0,
          pendingApplications: 0,
        });
      } catch (err) {
        console.error(err);
        setDashboardError("Failed to load dashboard data.");
      }
    };

    fetchDashboardData();
  }, [token, user]);

  // NGO: Create Opportunity
  const handleCreateOpportunity = (e) => {
    e.preventDefault();
    setActionError("");

    if (!user || !token) {
      setActionError("Please login first.");
      return;
    }

    if (userRole !== "NGO") {
      setActionError("Access denied: Only NGO users can create opportunities.");
      return;
    }

    fetch("http://localhost:5000/api/opportunities", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or invalid token");
        navigate("/create-opportunity");
      })
      .catch((err) => {
        console.error(err);
        setActionError("Session expired. Please login again.");
      });
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="org-name">
          {user?.organizationName || "Skill-Bridge"}
        </h2>
        <p className="org-type">{userRole}</p>

        <nav className="menu">
          <button className="menu-item active">Dashboard</button>

          <button
            className="menu-item"
            onClick={() => navigate("/opportunities")}
          >
            Opportunities
          </button>

          <button
            className="menu-item"
            onClick={() => navigate("/dashboard/applications")}
          >
            Applications
          </button>

          <button
            className="menu-item"
            onClick={() => navigate("/messages")}
          >
            Messages
          </button>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="main-content">
        <h1 className="welcome">
          Welcome {fullName || user?.fullName || "User"} 👋
        </h1>

        {dashboardError && <p className="error-msg">{dashboardError}</p>}
        {actionError && <p className="error-msg">{actionError}</p>}

        {/* Stats */}
        <section className="overview">
          <div className="card blue">
            <h2>{stats.activeOpportunities}</h2>
            <p>Active Opportunities</p>
          </div>

          <div className="card green">
            <h2>{stats.applications}</h2>
            <p>Applications</p>
          </div>

          <div className="card purple">
            <h2>{stats.activeVolunteers}</h2>
            <p>Active Volunteers</p>
          </div>

          <div className="card yellow">
            <h2>{stats.pendingApplications}</h2>
            <p>Pending Applications</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="section">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            {userRole === "NGO" && (
              <button className="action-btn" onClick={handleCreateOpportunity}>
                ➕ Create New Opportunity
              </button>
            )}

            <button
              className="action-btn"
              onClick={() => navigate("/messages")}
            >
              💬 View Messages
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
