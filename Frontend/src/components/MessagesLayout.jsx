import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdChat, MdSearch } from "react-icons/md";

function MessagesLayout() {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <div className="h-[100dvh] flex bg-gradient-to-b from-gray-50 to-gray-100">

      {/* LEFT PANEL - Chat List */}
      <div className="w-[35%] min-w-[300px] bg-white border-r flex flex-col shadow-lg">
        <div className="h-16 px-4 flex items-center border-b bg-white">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-md">
              <MdChat className="text-xl" />
            </div>
            <h2 className="font-bold text-lg text-gray-800">Messages</h2>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b">
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
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="px-4 py-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="px-4 py-8 flex justify-center">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : filteredChats.length === 0 && !error ? (
            <div className="px-4 py-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <MdChat className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">
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
                  onClick={() =>
                    navigate(`/messages/${app._id}`)
                  }
                  className="px-4 py-4 cursor-pointer hover:bg-orange-50 border-b border-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold shadow-md group-hover:shadow-lg transition-shadow">
                      {avatarInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">{name}</p>
                      <p className="text-xs text-gray-500 truncate group-hover:text-orange-600 transition-colors">
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
      <div className="flex-1 flex flex-col min-w-0 shadow-xl">
        <Outlet />
      </div>
    </div>
  );
}

export default MessagesLayout;
