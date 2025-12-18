import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showMobile, setShowMobile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const toggleMobile = () => setShowMobile(!showMobile);
  const toggleProfile = () => setShowProfile(!showProfile);

  // Update login status when component mounts or location changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    console.log("Token:", token); // Debug
    console.log("User data:", userData); // Debug
    
    setIsLoggedIn(!!token);
    setUser(userData ? JSON.parse(userData) : {});
  }, [location]);

  // Check if we're on dashboard-related pages
  const isDashboardArea = location.pathname.includes('/dashboard') || 
                          location.pathname.includes('/opportunities') ||
                          location.pathname.includes('/create-opportunity') ||
                          location.pathname.includes('/edit-opportunity') ||
                          location.pathname.includes('/applications') ||
                          location.pathname.includes('/messages');

  // Check if we're on home page
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

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
        {/* Show only Home and About on home page */}
        {isHomePage ? (
          <>
            <Link to="/home" className="font-semibold hover:text-orange-500 transition">Home</Link>
            <Link to="/about" className="font-semibold hover:text-orange-500 transition">About</Link>
          </>
        ) : isDashboardArea ? (
          /* Show Dashboard navigation when in dashboard area */
          <>
            <Link to="/dashboard" className="font-semibold hover:text-orange-500 transition">Dashboard</Link>
            <Link to="/opportunities" className="font-semibold hover:text-orange-500 transition">Opportunities</Link>
            <Link to="/applications" className="font-semibold hover:text-orange-500 transition">Applications</Link>
            <Link to="/messages" className="font-semibold hover:text-orange-500 transition">Messages</Link>
          </>
        ) : (
          /* Default navigation for other pages */
          <>
            <Link to="/home" className="font-semibold hover:text-orange-500 transition">Home</Link>
            <Link to="/about" className="font-semibold hover:text-orange-500 transition">About</Link>
            <Link to="/opportunities" className="font-semibold hover:text-orange-500 transition">Opportunities</Link>
            {isLoggedIn && (
              <Link to="/dashboard" className="font-semibold hover:text-orange-500 transition">Dashboard</Link>
            )}
          </>
        )}
      </div>

      {/* DESKTOP AUTH / PROFILE */}
      <div className="hidden lg:flex items-center gap-6 relative">
        {isLoggedIn ? (
          /* Show Profile when logged in */
          <>
            {/* PROFILE BUTTON */}
            <button
              onClick={toggleProfile}
              className="flex items-center gap-2 font-semibold hover:text-orange-500 transition"
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
                  <span className="font-semibold">{user?.email || "user@example.com"}</span>
                </div>
                <hr />

                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowProfile(false)}>
                  My Profile
                </Link>
                <Link to="/help" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowProfile(false)}>
                  Help
                </Link>
                <Link to="/community" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowProfile(false)}>
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
        ) : (
          /* Show Login/Signup when not logged in */
          <>
            <Link to="/login" className="font-semibold hover:text-orange-500 transition">Login</Link>
            <Link
              to="/signup"
              className="bg-orange-500 rounded-lg text-white px-4 py-2 font-semibold hover:bg-orange-600 transition"
            >
              Sign up
            </Link>
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
          {/* Mobile Navigation based on page */}
          {isHomePage ? (
            <>
              <Link to="/home" onClick={toggleMobile}>Home</Link>
              <Link to="/about" onClick={toggleMobile}>About</Link>
            </>
          ) : isDashboardArea ? (
            <>
              <Link to="/dashboard" onClick={toggleMobile}>Dashboard</Link>
              <Link to="/opportunities" onClick={toggleMobile}>Opportunities</Link>
              <Link to="/applications" onClick={toggleMobile}>Applications</Link>
              <Link to="/messages" onClick={toggleMobile}>Messages</Link>
            </>
          ) : (
            <>
              <Link to="/home" onClick={toggleMobile}>Home</Link>
              <Link to="/about" onClick={toggleMobile}>About</Link>
              <Link to="/opportunities" onClick={toggleMobile}>Opportunities</Link>
              {isLoggedIn && (
                <Link to="/dashboard" onClick={toggleMobile}>Dashboard</Link>
              )}
            </>
          )}

          {/* Mobile Auth/Profile */}
          {isLoggedIn ? (
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
          ) : (
            <>
              <Link to="/login" onClick={toggleMobile}>Login</Link>
              <Link to="/signup" onClick={toggleMobile}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;