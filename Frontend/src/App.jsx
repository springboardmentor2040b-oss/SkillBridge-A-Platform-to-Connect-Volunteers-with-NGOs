import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import About from "./components/About";
import Opportunities from "./components/Opportunities";
import Dashboard from "./components/Dashboard";
import Posted_Opportunities from "./components/postedopp";
import Messages from "./components/Messages";
import Applications from "./components/Application";

function App() {
  const location = useLocation();

  // Navbar should appear only on public pages
  const showNavbarRoutes = ["/", "/home", "/about", "/opportunities"];

  return (
    <>
     <Navbar/>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/postedopp" element={<Posted_Opportunities />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/application" element={<Applications />} />
      </Routes>

      {/* Footer always visible */}
    </>
  );
}

export default App;
