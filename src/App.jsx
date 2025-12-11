import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Landing Page Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Opportunities from "./components/Opportunities";
import Testimonials from "./components/Testimonials";
import Features from "./components/Features";
import Footer from "./components/Footer";

// Auth Pages
import Login from "./pages/login.jsx";
import SignupNGO from "./pages/signup-NGO.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect to Landing page */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Landing Page → Only show the frontend components */}
        <Route
          path="/home"
          element={
            <div className="min-h-screen bg-white">
              <Header />
              <Hero />
              <HowItWorks />
              <Opportunities />
              <Testimonials />
              <Features />
              <Footer />
            </div>
          }
        />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Signup page */}
        <Route path="/signup" element={<SignupNGO />} />
      </Routes>
    </Router>
  );
}

export default App;
