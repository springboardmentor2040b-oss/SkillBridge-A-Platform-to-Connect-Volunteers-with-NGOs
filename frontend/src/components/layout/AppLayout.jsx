import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import VolunteerLayout from "./VolunteerLayout";
import NgoLayout from "./NgoLayout";

const AppLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // If not logged in, block access
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role-based layout switch
  if (user.role === "volunteer") {
    return <VolunteerLayout />;
  }

  if (user.role === "ngo") {
    return <NgoLayout />;
  }

  // Fallback
  return <Navigate to="/login" />;
};

export default AppLayout;
