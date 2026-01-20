import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMenu, IoNotifications } from "react-icons/io5";
import { useState, useEffect, useCallback, useRef } from "react";
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

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setNotifications([]);
    setNotificationCount(0);
  };

  return (
    <nav className="w-full h-16 flex items-center justify-between bg-white px-4 lg:px-8 border-b border-slate-200 sticky top-0 z-50">
      {/* LOGO */}
      <Link to="/" className="text-xl font-bold text-orange-500">
        SkillBridge
      </Link>

      {/* DESKTOP LINKS */}
      <div className="hidden lg:flex gap-8">
        {isHomePage ? (
          <>
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/opportunities" className="nav-link">Opportunities</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/about" className="nav-link">About</Link>
          </>
        ) : isLoggedIn ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to={getOpportunitiesLink()} className="nav-link">
              Opportunities
            </Link>
            <Link to={getApplicationsLink()} className="nav-link">
              Applications
            </Link>
            <Link to="/messages" className="nav-link">Messages</Link>
          </>
        ) : (
          <>
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
          </>
        )}
      </div>

      {/* DESKTOP AUTH / PROFILE */}
      <div className="hidden lg:flex items-center gap-4 relative">
        {isLoggedIn ? (
          
          <>
            {/* NOTIFICATION  */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotifications}
                className="relative p-2.5 text-slate-600 hover:text-orange-600 hover:bg-slate-100 rounded-full transition-all duration-200"
              >
                <IoNotifications className="text-xl" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              
              {showNotifications && (
                <div className="absolute top-14 right-0 w-80 bg-white rounded-xl shadow-medium border border-slate-200 py-2 z-50 max-h-96 overflow-y-auto animate-slide-down">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Notifications</span>
                    {notificationCount > 0 && (
                      <button 
                        onClick={clearAllNotifications}
                        className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-slate-500 text-sm">
                      <IoNotifications className="text-3xl mx-auto mb-2 text-slate-300" />
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
                        className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {notif.senderName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800">
                              {notif.senderName || 'Someone'}
                            </p>
                            <p className="text-sm text-slate-600 truncate">
                              {notif.text}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
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
                      className="block px-4 py-3 text-center text-sm text-orange-600 hover:bg-orange-50 border-t border-slate-100 font-medium"
                    >
                      View all messages
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* PROFILE BUTTON */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-full hover:bg-slate-100 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-sm">
                  {(user?.fullName || user?.username || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {user?.fullName?.split(' ')[0] || "Profile"}
                </span>
              </button>

              
              {showProfile && (
                <div className="absolute top-14 right-0 w-56 bg-white rounded-xl shadow-medium border border-slate-200 py-2 z-50 animate-slide-down">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="font-medium text-slate-800 truncate">{user?.email}</p>
                  </div>

                  <Link to="/profile" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors" onClick={() => setShowProfile(false)}>
                    My Profile
                  </Link>
                  <Link to="/help" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors" onClick={() => setShowProfile(false)}>
                    Help
                  </Link>
                  <Link to="/community" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors" onClick={() => setShowProfile(false)}>
                    Community
                  </Link>

                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          
          <>
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign up
            </Link>
          </>
        )}
      </div>

      {/* MOBILE MENU ICON */}
      <div className="lg:hidden">
        <button 
          onClick={toggleMobile}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <IoMenu className="text-2xl text-slate-700" />
        </button>
      </div>

      {/* MOBILE MENU */}
      {showMobile && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg flex flex-col gap-1 px-4 py-4 lg:hidden z-50 animate-slide-down">
          {isHomePage ? (
            <>
              <Link to="/home" onClick={toggleMobile} className="px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium">Home</Link>
              <Link to="/opportunities" onClick={toggleMobile} className="px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium">Opportunities</Link>
              <Link to="/about" onClick={toggleMobile} className="px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium">About</Link>
            </>
          ) : isLoggedIn ? (
            <>
              <Link to="/dashboard" onClick={toggleMobile} className="px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium">Dashboard</Link>
              <Link to={getOpportunitiesLink()} onClick={toggleMobile} className="px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium">Opportunities</Link>
              <Link to={getApplicationsLink()} onClick={toggleMobile} className="px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium">Applications</Link>
              <Link to="/messages" onClick={toggleMobile} className="px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium">Messages</Link>
              <hr className="my-2 border-slate-200" />
              <Link to="/profile" onClick={toggleMobile} className="px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium">My Profile</Link>
              <button
                onClick={() => {
                  toggleMobile();
                  handleLogout();
                }}
                className="px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/home" onClick={toggleMobile} className="px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium">Home</Link>
              <Link to="/about" onClick={toggleMobile} className="px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium">About</Link>
              <hr className="my-2 border-slate-200" />
              <Link to="/login" onClick={toggleMobile} className="px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium">Login</Link>
              <Link to="/signup" onClick={toggleMobile} className="px-4 py-3 rounded-lg text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors font-medium text-center">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
