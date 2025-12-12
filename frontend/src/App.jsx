import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Opportunities from "./components/Opportunities";
import Testimonials from "./components/Testimonials";
import Features from "./components/Features";
import Footer from "./components/Footer";

import Login from "./pages/login";
import SignupNGO from "./pages/signup-NGO";
import SignupVolunteer from "./pages/SignupVolunteer.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        <Route
          path="/home"
          element={
            <div>
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

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupNGO />} />
      </Routes>
    </Router>
  );
}

export default App;
