import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Hero from "./Components/Hero";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";

function App() {
  const token = localStorage.getItem("token");
  const fullName = localStorage.getItem("fullName");
  const navigate = useNavigate();

  return (
    <>
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={
            <Hero
              goSignup={() => navigate("/signup")}
              goLogin={() => navigate("/login")}
            />
          }
        />

        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/signup"
          element={token ? <Navigate to="/dashboard" /> : <Signup />}
        />

        <Route
          path="/dashboard"
          element={
            token ? <Dashboard fullName={fullName} /> : <Navigate to="/login" />
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
