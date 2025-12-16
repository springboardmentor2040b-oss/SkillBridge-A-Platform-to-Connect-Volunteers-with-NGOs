import { Link, useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [showMobile, setShowMobile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleMobile = () => setShowMobile(!showMobile);
  const toggleProfile = () => setShowProfile(!showProfile);

  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="w-full h-14 flex items-center justify-between bg-white px-4 lg:px-8 shadow-md relative">

      {/* LOGO */}
      <Link to="/" className="text-lg font-bold text-black">
        SkillBridge
      </Link>

      {/* DESKTOP LINKS */}
      <div className="hidden lg:flex gap-12">
        <Link to="/home" className="font-semibold">Home</Link>
        <Link to="/about" className="font-semibold">About</Link>
        <Link to="/opportunities" className="font-semibold">Opportunities</Link>
        {isLoggedIn && (
          <Link to="/dashboard" className="font-semibold">Dashboard</Link>
        )}
      </div>

      {/* DESKTOP AUTH / PROFILE */}
      <div className="hidden lg:flex items-center gap-6 relative">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="font-semibold">Login</Link>
            <Link
              to="/signup"
              className="bg-orange-500 rounded-lg text-white px-4 py-2 font-semibold hover:bg-orange-600"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            {/* PROFILE BUTTON */}
            <button
              onClick={toggleProfile}
              className="flex items-center gap-2 font-semibold"
            >
              <div className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                {(user?.fullName || user?.username || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <span className="hidden sm:block">
                {user?.fullName || "Profile"}
              </span>
            </button>

            {/* PROFILE DROPDOWN */}
            {showProfile && (
              <div className="absolute top-12 right-0 w-56 bg-white border rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-600">
                  Signed in as <br />
                  <span className="font-semibold">{user?.email}</span>
                </div>
                <hr />

                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  My Profile
                </Link>
                <Link to="/help" className="block px-4 py-2 hover:bg-gray-100">
                  Help
                </Link>
                <Link to="/community" className="block px-4 py-2 hover:bg-gray-100">
                  Community
                </Link>

                <hr />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MOBILE MENU ICON */}
      <div className="lg:hidden">
        <IoMenu className="text-2xl cursor-pointer" onClick={toggleMobile} />
      </div>

      {/* MOBILE MENU */}
      {showMobile && (
        <div className="absolute top-14 left-0 w-full bg-gray-900 text-white flex flex-col gap-6 px-8 py-6 lg:hidden z-50">
          <Link to="/home" onClick={toggleMobile}>Home</Link>
          <Link to="/about" onClick={toggleMobile}>About</Link>
          <Link to="/opportunities" onClick={toggleMobile}>Opportunities</Link>

          {isLoggedIn && (
            <Link to="/dashboard" onClick={toggleMobile}>Dashboard</Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link to="/login" onClick={toggleMobile}>Login</Link>
              <Link to="/signup" onClick={toggleMobile}>Sign up</Link>
            </>
          ) : (
            <>
              <Link to="/profile" onClick={toggleMobile}>My Profile</Link>
              <Link to="/help" onClick={toggleMobile}>Help</Link>
              <Link to="/community" onClick={toggleMobile}>Community</Link>
              <button
                onClick={handleLogout}
                className="text-left text-red-400"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
