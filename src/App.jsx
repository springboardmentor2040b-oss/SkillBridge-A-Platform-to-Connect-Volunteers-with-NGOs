// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateOpportunity from "./pages/CreateOpportunity";
import NgoOpportunities from "./pages/NgoOpportunities";
import VolunteerOpportunities from "./pages/VolunteerOpportunities";
import Opportunities from "./pages/Opportunities";
import ApplyOpportunity from "./pages/ApplyOpportunity";
import Applications from "./pages/Applications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* NGO */}
        <Route path="/create-opportunity" element={<CreateOpportunity />} />
        <Route path="/ngo-opportunities" element={<NgoOpportunities />} />

        {/* Volunteer */}
        <Route
          path="/volunteer-opportunities"
          element={<VolunteerOpportunities />}
        />

        {/* Common */}
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/apply" element={<ApplyOpportunity />} />
        <Route path="/applications" element={<Applications />} />


      </Routes>
    </BrowserRouter>
  );
}
