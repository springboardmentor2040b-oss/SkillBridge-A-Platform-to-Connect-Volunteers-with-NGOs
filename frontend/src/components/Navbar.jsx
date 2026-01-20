import { Link } from "react-router-dom";
import Logo from "./Logo";
export default function Navbar() {
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
    </nav>
  );
}
