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
import Apply from "./components/Apply";

import Dashboard from "./components/Dashboard";
import Applications from "./components/Application";
import Profile from "./components/Profile";

// CHAT COMPONENTS
import MessagesLayout from "./components/MessagesLayout";
import Messages from "./components/Messages";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* OPPORTUNITIES */}
        <Route path="/opportunities" element={<NGOOpportunities />} />
        <Route path="/ngo-opportunities" element={<NGOOpportunities />} />
        <Route path="/create-opportunity" element={<CreateOpportunity />} />
        <Route path="/edit-opportunity/:id" element={<EditOpportunity />} />
        <Route path="/apply/:id" element={<Apply />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/application" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />

        {/* message */}
        <Route path="/messages" element={<MessagesLayout />}>
          <Route index element={<Messages />} />
          <Route path=":applicationId" element={<Messages />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
