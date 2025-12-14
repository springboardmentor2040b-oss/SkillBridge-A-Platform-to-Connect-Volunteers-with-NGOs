import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";

function Navbar() {
  const [show, setShow] = useState(false);

  function toggle() {
    setShow(!show);
  }

  return (
    <div className="w-full h-14 flex items-center justify-between text-white px-8 bg-slate-900 relative">
      {/* Logo */}
      <div className="text-white">
        <Link to="/" className="text-lg font-bold">SkillBridge</Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden lg:flex gap-8">
        <Link to="/home" className="font-semibold">Home</Link>
        <Link to="/about" className="font-semibold">About</Link>
        <Link to="/opportunities" className="font-semibold">Opportunities</Link>
        <Link to="/dashboard" className="font-semibold">Dashboard</Link>

      </div>

      {/* Desktop Auth */}
      <div className="hidden lg:flex items-center gap-8">
        <Link to="/login" className="font-semibold">Login</Link>
        <Link to="/signup" className="bg-purple-900 rounded-lg px-3 py-1 font-semibold">
          Sign up
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex lg:hidden">
        <IoMenu className="text-2xl cursor-pointer" onClick={toggle} />
      </div>

      {/* Mobile Dropdown Menu */}
      {show && (
        <div className="h-96 w-full px-5 absolute left-0 top-14 bg-gray-900 flex flex-col text-white gap-6 pt-6 lg:hidden">
          <Link to="/home" className="font-semibold">Home</Link>
          <Link to="/about" className="font-semibold">About</Link>
          <Link to="/opportunities" className="font-semibold">Opportunities</Link>
          <Link to="/login" className="font-semibold">Login</Link>
          <Link to="/signup" className="bg-purple-900 rounded-lg px-3 py-1 font-semibold">
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
