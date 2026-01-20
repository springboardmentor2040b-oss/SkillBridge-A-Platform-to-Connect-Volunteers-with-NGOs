import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MdChat, MdSearch } from "react-icons/md";
import socket, { joinNotifications, leaveNotifications } from "../socket";

function MessagesLayout() {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { applicationId } = useParams();
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
        console.log("Chats loaded with unread counts:", res.data);
        // Show all chats that have at least one message OR are accepted
        setChats(res.data.filter((a) => a.lastMessageText || a.status === "accepted" || a.unreadCount > 0));
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
  }, [role, token, isAuthenticated, applicationId]);

  // Real-time socket updates for unread counts and last messages
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    socket.connect();
    joinNotifications(userId);

    const handleNewMessage = (data) => {
      setChats(prev => prev.map(chat => {
        if (String(chat._id) === String(data.applicationId)) {
          const isCurrentChat = String(applicationId) === String(data.applicationId);
          return {
            ...chat,
            unreadCount: isCurrentChat ? 0 : (chat.unreadCount || 0) + 1,
            lastMessageText: data.text,
            lastMessageTime: new Date().toISOString()
          };
        }
        return chat;
      }));
    };

    const handleMessagesRead = (data) => {
      setChats(prev => prev.map(chat => {
        if (String(chat._id) === String(data.applicationId)) {
          return { ...chat, unreadCount: 0 };
        }
        return chat;
      }));
    };

    socket.on("receive-message", handleNewMessage);
    socket.on("messages-read", handleMessagesRead);
    socket.on("new-notification", handleNewMessage); // Handle notification data too

    return () => {
      socket.off("receive-message", handleNewMessage);
      socket.off("messages-read", handleMessagesRead);
      socket.off("new-notification", handleNewMessage);
      leaveNotifications(userId);
    };
  }, [isAuthenticated, userId, applicationId]);

  // Filter chats based on search
  const filteredChats = chats.filter((app) => {
    const name =
      role === "ngo"
        ? app.volunteer?.fullName || ""
        : app.opportunity?.ngo?.organizationName || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Format message time like WhatsApp
  const formatMsgTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="h-[100dvh] flex bg-gray-50">

      {/* LEFT PANEL - Chat List */}
      <div className="w-[35%] min-w-[340px] bg-white border-r flex flex-col shadow-lg">
        <div className="h-16 px-4 flex items-center justify-between border-b bg-white">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-md">
              <MdChat className="text-xl" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-gray-800">Messages</h2>
              {chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0) > 0 && (
                <span className="bg-orange-500 text-white text-[11px] font-black rounded-full w-6 h-6 flex items-center justify-center shadow-[0_2px_4px_rgba(249,115,22,0.3)] animate-pulse">
                  {chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 bg-white border-b">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
          {error && <div className="px-4 py-3 text-red-500 text-sm">{error}</div>}

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : filteredChats.length === 0 && !error ? (
            <div className="px-4 py-10 text-center text-gray-500 text-sm italic">
              {searchTerm ? "No results found" : "No active chats"}
            </div>
          ) : (
            filteredChats.map((app) => {
              const senderName = role === "ngo"
                ? (app.volunteer?.fullName || "Volunteer")
                : (app.opportunity?.ngo?.organizationName || app.opportunity?.ngo?.fullName || app.opportunity?.title || "NGO");

              const name = senderName || "User";
              const avatarInitial = name.charAt(0).toUpperCase();
              const hasUnread = app.unreadCount > 0;
              const displayTime = formatMsgTime(app.lastMessageTime || app.updatedAt);
              const isActive = applicationId === app._id;

              return (
                <div
                  key={app._id}
                  onClick={() => navigate(`/messages/${app._id}`)}
                  className={`px-4 py-4 cursor-pointer border-b border-gray-50 flex items-center gap-3 transition-colors ${isActive ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                    {avatarInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Row 1: Name, Badge, and Time */}
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center justify-between gap-2 min-w-0 flex-1">
                        <h3 className={`font-semibold text-sm truncate ${hasUnread ? 'text-gray-900' : 'text-gray-800'}`}>
                          {name}
                        </h3>
                        {hasUnread && (
                          <span className="bg-orange-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shrink-0 shadow-[0_2px_4px_rgba(249,115,22,0.3)]">
                            {app.unreadCount}
                          </span>
                        )}
                      </div>
                      <span className={`text-[11px] whitespace-nowrap ${hasUnread ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
                        {displayTime}
                      </span>
                    </div>
                    {/* Row 2: Last Message */}
                    <div className="flex justify-between items-center h-5">
                      <p className={`text-xs truncate flex-1 min-w-0 ${hasUnread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {app.lastMessageText || app.opportunity?.title || "No messages yet"}
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
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <Outlet />
      </div>
    </div>
  );
}

export default MessagesLayout;
