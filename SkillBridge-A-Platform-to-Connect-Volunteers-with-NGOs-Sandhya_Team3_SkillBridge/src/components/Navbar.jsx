import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-white/70 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm">

      {/* Logo */}
      <Link to="/">
        <Logo />
      </Link>
      {/* Navigation Links */}
      <div className="hidden md:flex gap-10 text-lg text-gray-700">
        <a href="#features" className="hover:text-blue-600">Features</a>
        <a href="#howitworks" className="hover:text-blue-600">How It Works</a>
        <a href="#about" className="hover:text-blue-600">About</a>
        <a href="#contact" className="hover:text-blue-600">Contact</a>
      </div>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700 text-2xl"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-gray-800 hover:text-blue-600 transition font-medium"
        >
          Sign In
        </Link>

        <Link
          to="/signup"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Get Started
        </Link>
      </div>
      {/* Mobile Navigation Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4 text-gray-700">
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#howitworks" className="hover:text-blue-600">How It Works</a>
            <a href="#about" className="hover:text-blue-600">About</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      )}

    </nav>
    
  );
}
