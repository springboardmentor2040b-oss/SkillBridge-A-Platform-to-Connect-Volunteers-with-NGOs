import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = ({ fullName }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    activeOpportunities: 0,
    applications: 0,
    activeVolunteers: 0,
    pendingApplications: 0,
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ------------------- Fetch Dashboard Data -------------------
  useEffect(() => {
    if (!token || !user) {
      setError("Please login to access dashboard.");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const oppRes = await axios.get(
          "http://localhost:5000/api/opportunities",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const opportunities = Array.isArray(oppRes.data)
          ? oppRes.data
          : [];

        const activeOpps = opportunities.filter(
          (opp) => opp.status === "OPEN"
        ).length;

        setStats({
          activeOpportunities: activeOpps,
          applications: 0,        // backend not implemented yet
          activeVolunteers: 0,    // backend not implemented yet
          pendingApplications: 0, // backend not implemented yet
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      }
    };

    fetchDashboardData();
  }, [token, user]);

  // ------------------- Create Opportunity -------------------
  const handleCreateOpportunity = () => {
    if (user?.role !== "NGO") {
      setError("Only NGO users can create opportunities.");
      return;
    }
    navigate("/create-opportunity");
  };

  return (
    <div className="dashboard-layout">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="sidebar">
        <h2 className="org-name">
          {user?.organizationName || "Organization"}
        </h2>
        <p className="org-type">{user?.role}</p>

        <nav className="menu">
          <button className="menu-item active">Dashboard</button>

          <button
            className="menu-item"
            onClick={() => navigate("/opportunities")}
          >
            Opportunities
          </button>

          <button className="menu-item">Applications</button>
          <button className="menu-item">Messages</button>
        </nav>
      </aside>

      {/* ---------------- Main Content ---------------- */}
      <main className="main-content">
        <h1 className="welcome">
          Welcome {fullName || user?.fullName || "User"} 👋
        </h1>

        {error && <p className="error-msg">{error}</p>}

        {/* ---------------- Overview Cards ---------------- */}
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

        {/* ---------------- Recent Applications ---------------- */}
        <section className="section">
          <div className="section-header">
            <h3>Recent Applications</h3>
            <button className="view-all">View All</button>
          </div>

          <p className="muted-text">
            No applications received yet.
          </p>
        </section>

        {/* ---------------- Quick Actions ---------------- */}
        <section className="section">
          <h3>Quick Actions</h3>

          <div className="quick-actions">
            <button className="action-btn" onClick={handleCreateOpportunity}>
              ➕ Create New Opportunity
            </button>

            <button className="action-btn">💬 View Messages</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
