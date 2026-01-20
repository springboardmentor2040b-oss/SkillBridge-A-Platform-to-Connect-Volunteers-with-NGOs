import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Hero from "./Components/Hero";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import AccountSettings from "./Components/Accountsettings";
import CreateOpportunity from "./Components/CreateOpportunity";
import Opportunities from "./Components/Opportunities";
import ApplyOpportunity from "./Components/ApplyOpportunity";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });

  // Optional: keep currentUser in sync with Local Storage
  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(user);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Helper component for protected routes
  const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      // Not logged in → redirect to login
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Helper component for NGO-only routes
  const NGORoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.userType?.trim().toUpperCase();
    if (role !== "NGO") {
      alert("Access Denied: Only NGO users can access this page.");
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <>
      <NavBar user={currentUser} />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Create Opportunity - NGO only */}
        <Route
          path="/create-opportunity"
          element={
            <ProtectedRoute>
              <NGORoute>
                <CreateOpportunity />
              </NGORoute>
            </ProtectedRoute>
          }
        />

        {/* View Opportunities - all logged-in users */}
        <Route
          path="/opportunities"
          element={
            <ProtectedRoute>
              <Opportunities />
            </ProtectedRoute>
          }
        />

        {/* Apply Opportunity - all logged-in users */}
        <Route
          path="/apply/:id"
          element={
            <ProtectedRoute>
              <ApplyOpportunity />
            </ProtectedRoute>
          }
        />

        {/* Account Settings */}
        <Route
          path="/account-settings"
          element={
            <ProtectedRoute>
              <AccountSettings onUserUpdate={setCurrentUser} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route → redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
