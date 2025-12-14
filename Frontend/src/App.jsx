
import { Routes, Route } from "react-router-dom";

import { Routes, Route, useLocation } from "react-router-dom";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./components/Home";
import Signup from "./components/Signup";

import About from "./components/About";
import Login from "./components/Login";

import Opportunities from "./components/Opportunities";
import Dashboard from "./components/Dashboard";
import Posted_Opportunities from "./components/postedopp";
import Messages from "./components/Messages";
import Applications from "./components/Application";

import Profile from "./components/Profile";

function App() {
  return (
    <>
      {/* Navbar ALWAYS visible */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/postedopp" element={<Posted_Opportunities />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/application" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* Footer ONLY for public pages */}
      <Footer />
    </>
  );
}

export default App;
