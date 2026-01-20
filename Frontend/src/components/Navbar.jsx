import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { useState, useEffect } from "react";
import socket, { joinNotifications, leaveNotifications } from "../socket";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showMobile, setShowMobile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleMobile = () => setShowMobile(!showMobile);
  const toggleProfile = () => setShowProfile(!showProfile);

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:4001/api/messages/unread/count", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  // Update login status and fetch count when component mounts or location changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    setIsLoggedIn(!!token);
    setUser(userData ? JSON.parse(userData) : {});

    if (token) {
      fetchUnreadCount();
    }
  }, [location]);

  // Socket listener for real-time count updates
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData.id;
    if (!userId) return;

    socket.connect();
    joinNotifications(userId);

    const handleUpdate = () => fetchUnreadCount();
    socket.on("receive-message", handleUpdate);
    socket.on("messages-read", handleUpdate);
    socket.on("new-notification", handleUpdate);

    return () => {
      socket.off("receive-message", handleUpdate);
      socket.off("messages-read", handleUpdate);
      socket.off("new-notification", handleUpdate);
    };
  }, []);

  // Get user role
  const userRole = user?.role;
  const isNGO = userRole === 'ngo';
  const isVolunteer = userRole === 'volunteer';

  const currentPath = location.pathname;

  // Check if we're on home page
  const isHomePage = currentPath === '/' || currentPath === '/home';

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser({});
    navigate("/login");
  };

  // Helper function to get the correct opportunities link based on role
  const getOpportunitiesLink = () => {
    if (isNGO) return '/ngo-opportunities';
    return '/opportunities';
  };

  // Helper function to get the correct applications link based on role
  const getApplicationsLink = () => {
    if (isNGO) return '/application'; // NGO sees applications received
    return '/application'; // Volunteer sees their applications
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="w-full h-14 flex items-center justify-between bg-white px-4 lg:px-8 shadow-md relative">
      {/* LOGO */}
      <Link to="/" className="text-lg font-bold text-black">
        SkillBridge
      </Link>

      {/* DESKTOP LINKS */}
      <div className="hidden lg:flex gap-12">
        {isHomePage ? (
          /* Home Page Navigation */
          <>
            <Link to="/home" className={`font-semibold transition ${currentPath === '/home' || currentPath === '/' ? 'text-orange-500 border-b-2 border-orange-500' : 'hover:text-orange-500'}`}>Home</Link>
            <button onClick={() => scrollToSection('about')} className="font-semibold transition hover:text-orange-500">About</button>
          </>
        ) : isLoggedIn ? (
          /* Logged in user navigation - dynamically route based on role */
          <>
            <Link to="/dashboard" className={`font-semibold transition ${currentPath === '/dashboard' ? 'text-orange-500 border-b-2 border-orange-500' : 'hover:text-orange-500'}`}>Dashboard</Link>
            <Link to={getOpportunitiesLink()} className={`font-semibold transition ${currentPath === getOpportunitiesLink() || currentPath === '/opportunities' ? 'text-orange-500 border-b-2 border-orange-500' : 'hover:text-orange-500'}`}>
              Opportunities
            </Link>
            <Link to={getApplicationsLink()} className={`font-semibold transition ${currentPath === '/application' || currentPath === '/my-applications' ? 'text-orange-500 border-b-2 border-orange-500' : 'hover:text-orange-500'}`}>
              Applications
            </Link>
            <Link to="/messages" className={`font-semibold transition flex items-center gap-2 ${currentPath.startsWith('/messages') ? 'text-orange-500 border-b-2 border-orange-500' : 'hover:text-orange-500'}`}>
              Messages
              {unreadCount > 0 && (
                <span className="bg-orange-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shrink-0 shadow-[0_2px_4px_rgba(249,115,22,0.3)] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>
          </>
        ) : (
          /* Not logged in - show basic navigation */
          <>
            <Link to="/home" className={`font-semibold transition ${currentPath === '/home' || currentPath === '/' ? 'text-orange-500 border-b-2 border-orange-500' : 'hover:text-orange-500'}`}>Home</Link>
            <button onClick={() => scrollToSection('about')} className="font-semibold transition hover:text-orange-500">About</button>
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
              <Link to="/home" onClick={toggleMobile} className={currentPath === '/home' || currentPath === '/' ? 'text-orange-500 font-bold' : ''}>Home</Link>
              <button onClick={() => { scrollToSection('about'); toggleMobile(); }} className="text-left">About</button>
            </>
          ) : isLoggedIn ? (
            /* Logged in mobile navigation */
            <>
              <Link to="/dashboard" onClick={toggleMobile} className={currentPath === '/dashboard' ? 'text-orange-500 font-bold' : ''}>Dashboard</Link>
              <Link to={getOpportunitiesLink()} onClick={toggleMobile} className={currentPath === getOpportunitiesLink() || currentPath === '/opportunities' ? 'text-orange-500 font-bold' : ''}>
                Opportunities
              </Link>
              <Link to={getApplicationsLink()} onClick={toggleMobile} className={currentPath === '/application' || currentPath === '/my-applications' ? 'text-orange-500 font-bold' : ''}>
                Applications
              </Link>
              <Link to="/messages" onClick={toggleMobile} className={`flex items-center justify-between ${currentPath.startsWith('/messages') ? 'text-orange-500 font-bold' : ''}`}>
                Messages
                {unreadCount > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shrink-0 shadow-[0_2px_4px_rgba(249,115,22,0.3)]">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            /* Not logged in mobile navigation */
            <>
              <Link to="/home" onClick={toggleMobile} className={currentPath === '/home' || currentPath === '/' ? 'text-orange-500 font-bold' : ''}>Home</Link>
              <button onClick={() => { scrollToSection('about'); toggleMobile(); }} className="text-left">About</button>
            </>
          )}

          {/* Mobile Auth/Profile */}
          {isLoggedIn ? (
            <>
              <Link to="/profile" onClick={toggleMobile}>My Profile</Link>
              <Link to="/help" onClick={toggleMobile}>Help</Link>
              <Link to="/community" onClick={toggleMobile}>Community</Link>
              <button
                onClick={() => {
                  toggleMobile();
                  handleLogout();
                }}
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