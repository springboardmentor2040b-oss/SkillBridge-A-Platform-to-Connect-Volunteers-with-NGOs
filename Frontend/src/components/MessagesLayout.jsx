import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdChat, MdSearch, MdArrowBack } from "react-icons/md";

function MessagesLayout() {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showChatList, setShowChatList] = useState(true); // For mobile navigation
  const navigate = useNavigate();

  // Get auth data from localStorage
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const role = userData.role;
  const userId = userData.id;

  // Validate auth data exists
  const isAuthenticated = token && userId && role;

  useEffect(() => {
    // Don't make API call if not authenticated
    if (!isAuthenticated) {
      setIsLoading(false);
      setError("Please log in to view chats");
      return;
    }

    const url =
      role === "ngo"
        ? "http://localhost:4001/api/applications/ngo"
        : "http://localhost:4001/api/applications/volunteer";

    setIsLoading(true);
    setError(null);
    
    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setChats(res.data.filter((a) => a.status === "accepted"));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading chats:", err);
        setIsLoading(false);
        if (err.response?.status === 403) {
          setError("Unauthorized. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setError("Failed to load chats");
        }
      });
  }, [role, token, isAuthenticated]);

  // Filter chats based on search
  const filteredChats = chats.filter((app) => {
    const name =
      role === "ngo"
        ? app.volunteer?.fullName || ""
        : app.opportunity?.ngo?.organizationName || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleChatSelect = (appId) => {
    navigate(`/messages/${appId}`);
    // On mobile, hide chat list and show chat window
    if (window.innerWidth < 768) {
      setShowChatList(false);
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
    navigate("/messages");
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row bg-slate-50 overflow-hidden">

      {/* LEFT PANEL - Chat List */}
      <div className={`${showChatList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[320px] lg:w-[360px] bg-white border-r border-slate-200 shadow-sm flex-shrink-0`}>
        <div className="h-16 px-4 flex items-center border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md">
              <MdChat className="text-xl" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-800">Messages</h2>
              <p className="text-xs text-slate-500">{filteredChats.length} conversations</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="px-4 py-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="px-4 py-8 flex justify-center">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : filteredChats.length === 0 && !error ? (
            <div className="px-4 py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <MdChat className="text-3xl text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm">
                {searchTerm ? "No conversations found" : "No active chats yet"}
              </p>
            </div>
          ) : (
            filteredChats.map((app) => {
              const name =
                role === "ngo"
                  ? app.volunteer?.fullName || "Unknown Volunteer"
                  : app.opportunity?.ngo?.organizationName || "Unknown NGO";
              const avatarInitial = name.charAt(0).toUpperCase();

              return (
                <div
                  key={app._id}
                  onClick={() => handleChatSelect(app._id)}
                  className="px-4 py-4 cursor-pointer hover:bg-orange-50 border-b border-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
                      {avatarInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 truncate">{name}</p>
                      <p className="text-xs text-slate-500 truncate group-hover:text-orange-600 transition-colors">
                        {app.opportunity?.title || "View conversation"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT Chat Window */}
      <div className={`${!showChatList ? 'flex' : 'hidden'} md:flex flex-col flex-1 min-w-0 bg-slate-50`}>
        {/* Mobile back button header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:hidden flex-shrink-0">
          <button
            onClick={handleBackToList}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors -ml-2"
          >
            <MdArrowBack className="h-5 w-5 text-slate-600" />
          </button>
          <span className="ml-2 font-semibold text-slate-800">Back to messages</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default MessagesLayout;

