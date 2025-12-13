import React from "react";
import "./Dashboard.css";

const Dashboard = ({ fullName }) => {
  return (
    <div className="dashboard-container">
      <h1>Welcome {fullName || "User"} 👋</h1>
    </div>
  );
};

export default Dashboard;
