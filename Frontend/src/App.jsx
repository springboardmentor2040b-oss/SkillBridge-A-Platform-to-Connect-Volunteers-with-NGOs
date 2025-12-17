import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./components/Home";
import Signup from "./components/Signup";
import About from "./components/About";
import Login from "./components/Login";

import NGOOpportunities from "./components/NGOOpportunities";
import CreateOpportunity from "./components/CreateOpportunity";

import Dashboard from "./components/Dashboard";
import PostedOpportunities from "./components/postedopp";
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

        <Route path="/opportunities" element={<NGOOpportunities />} />

        {/* Redirect old path to new path */}
        <Route
          path="/createOpportunity"
          element={<Navigate to="/create-opportunity" replace />}
        />
        <Route path="/create-opportunity" element={<CreateOpportunity />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/postedopp" element={<PostedOpportunities />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/application" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
