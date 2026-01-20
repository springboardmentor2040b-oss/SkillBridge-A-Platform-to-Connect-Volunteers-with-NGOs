import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";     // ✅ use same socket as chat
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
    unreadMessages: 0,
  });

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const userRole = user?.userType?.trim().toUpperCase();

  /* ======================================================
     LIVE FETCH FUNCTION (USED EVERY FEW SECONDS)
  ====================================================== */
  const loadDashboardLive = async () => {
    if (!token || !user) return;

    try {
      /* ===== 1. OPPORTUNITIES ===== */
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

      /* ===== 2. APPLICATIONS ===== */
      let applications = 0;
      let pending = 0;

      try {
        const appRes = await axios.get(
          "http://localhost:5000/api/applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const apps = appRes.data || [];

        applications = apps.length;

        pending = apps.filter(
          (a) => a.status === "PENDING"
        ).length;

      } catch (e) {
        console.log("Applications fetch failed");
      }

      /* ===== 3. UNREAD MESSAGES ===== */
      let unread = 0;

      try {
        const chatRes = await axios.get(
          `http://localhost:5000/api/chat/user/${user._id}`
        );

        const all = chatRes.data || [];

        unread = all.filter(
          (m) => m.seen === false && m.senderId !== user._id
        ).length;

      } catch (e) {
        console.log("Chat count failed");
      }

      setStats({
        activeOpportunities: activeOpps,
        applications,
        activeVolunteers: 0,       // you can connect later
        pendingApplications: pending,
        unreadMessages: unread,
      });

    } catch (err) {
      setDashboardError("Failed to load dashboard data.");
    }
  };

  /* ======================================================
     INITIAL LOAD + AUTO REFRESH EVERY 5 SEC
  ====================================================== */
  useEffect(() => {
    if (!token || !user) {
      setDashboardError("Please login to access dashboard.");
      return;
    }

    // First load
    loadDashboardLive();

    // Auto refresh every 5 seconds
    const interval = setInterval(() => {
      loadDashboardLive();
    }, 5000);

    return () => clearInterval(interval);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /* ======================================================
     SOCKET LISTENERS FOR REAL TIME CHAT
  ====================================================== */
  useEffect(() => {

    socket.on("receiveMessage", () => {
      loadDashboardLive();     // refresh when new msg arrives
    });

    return () => {
      socket.off("receiveMessage");
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ======================================================
     NGO CREATE OPPORTUNITY
  ====================================================== */
  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    setActionError("");

    if (!user || !token) {
      setActionError("Please login first.");
      return;
    }

    if (userRole !== "NGO") {
      setActionError("Access denied.");
      return;
    }

    navigate("/create-opportunity");
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
            {stats.unreadMessages > 0 && (
              <span className="badge">
                {stats.unreadMessages}
              </span>
            )}
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="main-content">

        <h1 className="welcome">
          Welcome {fullName || user?.fullName || "User"} 👋
        </h1>

        {dashboardError && (
          <p className="error-msg">{dashboardError}</p>
        )}

        {actionError && (
          <p className="error-msg">{actionError}</p>
        )}

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

          <div className="card red">
            <h2>{stats.unreadMessages}</h2>
            <p>Unread Messages</p>
          </div>

        </section>

        <section className="section">
          <h3>Quick Actions</h3>

          <div className="quick-actions">

            {userRole === "NGO" && (
              <button
                className="action-btn"
                onClick={handleCreateOpportunity}
              >
                ➕ Create New Opportunity
              </button>
            )}

            <button
              className="action-btn"
              onClick={() => navigate("/messages")}
            >
              💬 View Messages
              {stats.unreadMessages > 0 && (
                <span className="badge">
                  {stats.unreadMessages}
                </span>
              )}
            </button>

          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
