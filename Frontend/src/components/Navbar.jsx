import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMenu, IoNotifications, IoSettingsOutline } from "react-icons/io5";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import socket, { joinNotifications, leaveNotifications } from "../socket";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showMobile, setShowMobile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const toggleMobile = () => setShowMobile(!showMobile);
  const toggleProfile = () => setShowProfile(!showProfile);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  // Get 
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userData.id;

  //unread notification count
  const fetchUnreadCount = useCallback(async () => {
    if (!token || !userId) return;

    try {
      const res = await axios.get("http://localhost:4001/api/messages/unread/count", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotificationCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, [token, userId]);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    setIsLoggedIn(!!token);
    setUser(userData ? JSON.parse(userData) : {});
  }, [location]);

  useEffect(() => {
    if (!token || !userId) return;

   
    socket.connect();
    joinNotifications(userId);

    
    const handleNewNotification = (data) => {
      
      if (data.recipientId === userId && data.senderId !== userId) {
        setNotificationCount(prev => prev + 1);
        setNotifications(prev => [{
          id: Date.now(),
          text: data.text,
          senderName: data.senderName,
          applicationId: data.applicationId,
          createdAt: new Date()
        }, ...prev.slice(0, 4)]); 
      }
    };

    socket.on("new-notification", handleNewNotification);

    fetchUnreadCount();

    return () => {
      leaveNotifications(userId);
      socket.off("new-notification", handleNewNotification);
      socket.disconnect();
    };
  }, [token, userId, fetchUnreadCount]);

  const userRole = user?.role;
  const isNGO = userRole === 'ngo';
  const isVolunteer = userRole === 'volunteer';

  const currentPath = location.pathname;

  const isHomePage = currentPath === '/' || currentPath === '/home';

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser({});
    navigate("/login");
  };

  const getOpportunitiesLink = () => {
    if (isNGO) return '/ngo-opportunities';
    return '/opportunities';
  };

  
  const getApplicationsLink = () => {
    if (isNGO) return '/application'; 
    return '/application'; 
  };

  // notifications
  const clearAllNotifications = async () => {
    // Clear local state
    setNotifications([]);
    setNotificationCount(0);
    
    
  };

  return (
    <nav className="w-full h-14 flex items-center justify-between bg-white px-4 lg:px-8 shadow-md relative">
      {/* LOGO */}
      <Link to="/" className="text-lg font-bold text-orange-500">
        SkillBridge
      </Link>

      {/* DESKTOP LINKS */}
      <div className="hidden lg:flex gap-12">
        {isHomePage ? (
          /* Home Page Navigation */
          <>
            <Link to="/home" className="font-semibold hover:text-orange-500 transition">Home</Link>
            <Link to="/opportunities" className="font-semibold hover:text-orange-500 transition">Opportunities</Link>
            <Link to="/dashboard" className="font-semibold hover:text-orange-500 transition">Dashboard</Link>
            <Link to="/about" className="font-semibold hover:text-orange-500 transition">About</Link>
          </>
        ) : isLoggedIn ? (
          /* Logged in user navigation - dynamically route based on role */
          <>
            <Link to="/dashboard" className="font-semibold hover:text-orange-500 transition">Dashboard</Link>
            <Link to={getOpportunitiesLink()} className="font-semibold hover:text-orange-500 transition">
              Opportunities
            </Link>
            <Link to={getApplicationsLink()} className="font-semibold hover:text-orange-500 transition">
              Applications
            </Link>
            <Link to="/messages" className="font-semibold hover:text-orange-500 transition">Messages</Link>
          </>
        ) : (
          /* Not logged in - show basic navigation */
          <>
            <Link to="/home" className="font-semibold hover:text-orange-500 transition">Home</Link>
            <Link to="/about" className="font-semibold hover:text-orange-500 transition">About</Link>
          </>
        )}
      </div>

      {/* DESKTOP AUTH / PROFILE */}
      <div className="hidden lg:flex items-center gap-6 relative">
        {isLoggedIn ? (
          
          <>
            {/* NOTIFICATION  */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative p-2 text-gray-600 hover:text-orange-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoNotifications className="text-xl" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              
              {showNotifications && (
                <div className="absolute top-12 right-0 w-80 bg-white border rounded-lg shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 py-2 border-b font-semibold text-gray-700 flex items-center justify-between">
                    <span>Notifications</span>
                    {notificationCount > 0 && (
                      <button 
                        onClick={clearAllNotifications}
                        className="text-xs text-orange-500 hover:text-orange-600"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                      <IoNotifications className="text-3xl mx-auto mb-2 opacity-50" />
                      <p>No new notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          navigate(`/messages/${notif.applicationId}`);
                          setShowNotifications(false);
                        }}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {notif.senderName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800">
                              {notif.senderName || 'Someone'}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {notif.text}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notif.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {notifications.length > 0 && (
                    <Link
                      to="/messages"
                      onClick={() => setShowNotifications(false)}
                      className="block px-4 py-2 text-center text-sm text-orange-500 hover:bg-gray-50 border-t"
                    >
                      View all mes
                    </Link>
                  )}
                </div>
              )}
            </div>

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
          ) : isLoggedIn ? (
            /* Logged in mobile navigation */
            <>
              <Link to="/dashboard" onClick={toggleMobile}>Dashboard</Link>
              <Link to={getOpportunitiesLink()} onClick={toggleMobile}>
                Opportunities
              </Link>
              <Link to={getApplicationsLink()} onClick={toggleMobile}>
                Applications
              </Link>
              <Link to="/messages" onClick={toggleMobile}>Messages</Link>
            </>
          ) : (
            /* Not logged in mobile navigation */
            <>
              <Link to="/home" onClick={toggleMobile}>Home</Link>
              <Link to="/about" onClick={toggleMobile}>About</Link>
            </>
          )}

          
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