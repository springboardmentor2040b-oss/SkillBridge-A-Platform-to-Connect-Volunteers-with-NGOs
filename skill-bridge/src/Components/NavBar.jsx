import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    navigate("/login"); // NO PAGE RELOAD
  };

  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <Link to="/">Home</Link>

      {!token && (
        <>
          {" | "} <Link to="/login">Login</Link>
          {" | "} <Link to="/signup">Signup</Link>
        </>
      )}

      {token && (
        <>
          {" | "} <Link to="/dashboard">Dashboard</Link>
          {" | "}
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
};

export default NavBar;
