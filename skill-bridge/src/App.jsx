import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Hero from "./Components/Hero";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import AccountSettings from "./Components/Accountsettings";
import CreateOpportunity from "./Components/CreateOpportunity";
import Opportunities from "./Components/Opportunities";
import ApplyOpportunity from "./Components/ApplyOpportunity"; // ✅ ADD

function App() {
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  return (
    <>
      <NavBar user={currentUser} />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Create Opportunity */}
        <Route
          path="/create-opportunity"
          element={<CreateOpportunity />}
        />

        {/* View Opportunities */}
        <Route
          path="/opportunities"
          element={<Opportunities />}
        />

        {/* ✅ APPLY OPPORTUNITY PAGE */}
        <Route
          path="/apply/:id"
          element={<ApplyOpportunity />}
        />

        <Route
          path="/account-settings"
          element={<AccountSettings onUserUpdate={setCurrentUser} />}
        />
      </Routes>
    </>
  );
}

export default App;
