// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Opportunities from "./pages/Opportunities";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import CreateOpportunity from "./pages/CreateOpportunity";
import Messages from "./pages/Messages";

// ❌ DO NOT import Messages until it exists

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-opportunity" element={<CreateOpportunity />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </BrowserRouter>
  );
}
