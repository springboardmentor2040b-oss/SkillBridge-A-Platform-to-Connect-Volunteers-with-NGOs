import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = ({ user }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="logo">
          <div className="logo-icon">SB</div>
          <h2>SkillBridge</h2>
        </div>

        {/* NAV LINKS */}
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>

          {/* ✅ FIXED View Opportunities */}
          {token && (
            <li>
              <button
                type="button"
                onClick={() => navigate("/opportunities")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  font: "inherit",
                  padding: 0
                }}
              >
                Opportunities
              </button>
            </li>
          )}

          {token && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
        </ul>

        {/* PROFILE SECTION */}
        {token && (
          <div className="nav-view-section">
            <div className="profile-wrapper" ref={profileRef}>
              <div
                className="profile-icon"
                onClick={() => setShowProfile(!showProfile)}
              >
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>

              {showProfile && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <div className="profile-icon large">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h4>{user?.username || user?.fullName || "User"}</h4>
                      <p>{user?.email}</p>
                      <span className="role">
                        {user?.role || user?.userType}
                      </span>
                    </div>
                  </div>

                  <hr />

                  <button
                    onClick={() => {
                      setShowProfile(false);
                      navigate("/account-settings");
                    }}
                  >
                    Account Settings
                  </button>

                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
