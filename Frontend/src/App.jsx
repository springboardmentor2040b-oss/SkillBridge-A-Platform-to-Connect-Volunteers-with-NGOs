import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./components/Home";
import Signup from "./components/Signup";
import About from "./components/About";
import Login from "./components/Login";

import NGOOpportunities from "./components/NGOOpportunities";
import VolunteerOpportunities from "./components/VolunteerOpportunities";
import CreateOpportunity from "./components/CreateOpportunity";
import EditOpportunity from "./components/EditOpportunity";

import Dashboard from "./components/Dashboard";
import Messages from "./components/Messages";
import Applications from "./components/Application";
import Profile from "./components/Profile";


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />

        {/* Main opportunities page - shows VolunteerOpportunities */}
        <Route path="/opportunities" element={<VolunteerOpportunities />} />
        
        {/* NGO-specific opportunities management */}
        <Route path="/ngo-opportunities" element={<NGOOpportunities />} />
        
        <Route
          path="/createOpportunity"
          element={<Navigate to="/create-opportunity" replace />}
        />
        <Route path="/create-opportunity" element={<CreateOpportunity />} />
        <Route path="/edit-opportunity/:id" element={<EditOpportunity />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/application" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;