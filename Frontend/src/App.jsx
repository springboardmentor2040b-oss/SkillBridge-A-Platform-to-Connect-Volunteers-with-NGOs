import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./components/Home";
import Signup from "./components/Signup";
import About from "./components/About";
import Login from "./components/Login";

import Opportunities from "./components/NGOOpportunities";
import Dashboard from "./components/Dashboard";
import Posted_Opportunities from "./components/postedopp";
import Messages from "./components/Messages";
import Applications from "./components/Application";
import Profile from "./components/Profile";

import CreateOpportunity from "./components/createopportunity";
import NGOOpportunities from "./components/NGOOpportunities";

function App() {
  return (
    <>
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
        <Route path="/create-opportunity" element={<CreateOpportunity />} />
        <Route path="/ngo-opportunities" element={<NGOOpportunities />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;