<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";
=======
import { Routes, Route, useLocation } from "react-router-dom";
>>>>>>> 69353cff15f7cdc6050289f05633c99f1b829e78

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./components/Home";
import Signup from "./components/Signup";
<<<<<<< HEAD
import About from "./components/About";
import Login from "./components/Login";
=======
import Login from "./components/Login";
import About from "./components/About";
>>>>>>> 69353cff15f7cdc6050289f05633c99f1b829e78
import Opportunities from "./components/Opportunities";
import Dashboard from "./components/Dashboard";
import Posted_Opportunities from "./components/postedopp";
import Messages from "./components/Messages";
import Applications from "./components/Application";
<<<<<<< HEAD
import Profile from "./components/Profile";

function App() {
  return (
    <>
      {/* Navbar ALWAYS visible */}
      <Navbar />

=======

function App() {
  const location = useLocation();

  // Navbar should appear only on public pages
  const showNavbarRoutes = ["/", "/home", "/about", "/opportunities"];

  return (
    <>
     <Navbar/>

      {/* Routes */}
>>>>>>> 69353cff15f7cdc6050289f05633c99f1b829e78
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
<<<<<<< HEAD
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
=======
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
>>>>>>> 69353cff15f7cdc6050289f05633c99f1b829e78
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/postedopp" element={<Posted_Opportunities />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/application" element={<Applications />} />
<<<<<<< HEAD
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* Footer ONLY for public pages */}
      <Footer />
=======
      </Routes>

      {/* Footer always visible */}
>>>>>>> 69353cff15f7cdc6050289f05633c99f1b829e78
    </>
  );
}

export default App;
