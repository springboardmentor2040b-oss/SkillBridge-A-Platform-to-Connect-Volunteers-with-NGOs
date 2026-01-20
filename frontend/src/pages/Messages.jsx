import React from "react";
import { useEffect, useState, useRef } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
import { FiTrash2, FiArrowLeft, FiSend } from "react-icons/fi";
import { getSocket } from "../socket";
import useChat from "../context/useChat";
import { useCallback } from "react";

export default function Messages() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationHandledRef = useRef(false);


  /* =========================================================
     1️⃣ STATE DECLARATIONS
     ========================================================= */

  // Chat messages (right panel)
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // Inbox data (left panel)
  const { conversations, setConversations } = useChat();
  const [applicants, setApplicants] = useState([]);

  // 🔐 SINGLE SOURCE OF TRUTH FOR SENDING
  const [chatContext, setChatContext] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [showChat, setShowChat] = useState(false);

  /* =========================================================
     2️⃣ DERIVED / HELPER VALUES
     ========================================================= */

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const role = currentUser?.role;
  const currentUserId = currentUser?._id;

  // Filter conversations by search text
  const filteredConversations = conversations.filter((conv) =>
    conv.participants.some((p) =>
      (p.fullName || "").toLowerCase().includes(search.toLowerCase()),
    ),
  );

  // Filter applicants / NGOs by search text
  const filteredApplicants = applicants.filter((app) =>
    app.user?.fullName?.toLowerCase().includes(search.toLowerCase()),
  );
  const fetchApplicants = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Fetch applications
      let res;
      if (role === "ngo") {
        res = await axios.get(
          "http://localhost:8000/api/applications/ngo-applications",
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        res = await axios.get(
          "http://localhost:8000/api/applications/volunteer-applications",
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }

      // 2️⃣ Normalize to user objects
      const rawApplicants = res.data.map((app) =>
        role === "ngo"
          ? { applicationId: app._id, user: app.volunteer_id }
          : { applicationId: app._id, user: app.opportunity_id.createdBy },
      );

      // 3️⃣ Remove duplicate users (same NGO / same volunteer)
      const uniqueMap = new Map();
      rawApplicants.forEach((item) => {
        if (!uniqueMap.has(item.user._id)) {
          uniqueMap.set(item.user._id, item);
        }
      });

      let uniqueApplicants = Array.from(uniqueMap.values());

      // 4️⃣ Remove users who already have conversations
      const conversationUserIds = new Set(
        conversations.map((conv) => {
          const otherUser = conv.participants.find(
            (p) => p._id !== currentUserId,
          );
          return otherUser?._id;
        }),
      );

      uniqueApplicants = uniqueApplicants.filter(
        (item) => !conversationUserIds.has(item.user._id),
      );

      // 5️⃣ Update state
      setApplicants(uniqueApplicants);
    } catch (err) {
      console.error("Failed to fetch applicants", err);
    }
  }, [role, conversations, currentUserId, setApplicants]);

  // Close chat function
    const closeChat = () => {
    if (selectedId) {
      const token = localStorage.getItem("token");
      axios.patch(
        `http://localhost:8000/api/messages/conversation/${selectedId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  
    setShowChat(false);
    setSelectedId(null);
    setChatContext(null);
    setMessages([]);
  };

  /* =========================================================
     4️⃣ API FUNCTIONS
     ========================================================= */

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8000/api/messages/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessages(res.data);
    } catch (err) {
      console.error(
        "FETCH MESSAGES ERROR 👉",
        err.response?.data || err.message,
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const context = chatContext;

    if (
      !context ||
      (context.type === "application" &&
        (!context.applicationId || !context.receiverId)) ||
      (context.type === "conversation" && !context.conversationId)
    ) {
      console.error("❌ Send blocked: invalid chatContext", context);
      return;
    }

    const token = localStorage.getItem("token");
    const payload = { text: newMessage };

    if (context.type === "conversation") {
      payload.conversationId = context.conversationId;
    } else if (context.type === "application") {
      payload.applicationId = context.applicationId;
      payload.receiverId = context.receiverId;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/messages",
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // setMessages((prev) => [...prev, res.data.message]);
      setConversations((prev) => {
        const exists = prev.some((c) => c._id === res.data.conversationId);

        // 🔥 FIRST MESSAGE → ADD CONVERSATION FOR SENDER
        if (!exists) {
          return [
            {
              _id: res.data.conversationId,
              participants: [
                { _id: currentUserId },
                {
                  _id: chatContext.receiverId,
                  fullName: chatContext.receiverName,
                },
              ],
              lastMessage: res.data.message,
              unreadCounts: {
                [currentUserId]: 0,
              },
            },
            ...prev,
          ];
        }

        // 🔥 EXISTING CONVERSATION → UPDATE LAST MESSAGE
        return prev.map((conv) =>
          conv._id === res.data.conversationId
            ? { ...conv, lastMessage: res.data.message }
            : conv,
        );
      });

      setNewMessage("");

      if (res.data.conversationId) {
        const newConversationId = res.data.conversationId;

        // 🔥 Switch chat context
        setChatContext((prev) => ({
          ...prev,
          type: "conversation",
          conversationId: newConversationId,
        }));
        // 🔥 CRITICAL: activate chat window for first message
        setSelectedId(res.data.conversationId);

        // 🔥 ADD conversation immediately for SENDER
        setConversations((prev) => {
          const exists = prev.some((c) => c._id === newConversationId);
          if (exists) return prev;

          return [
            {
              _id: newConversationId,
              participants: [
                { _id: currentUserId },
                {
                  _id: chatContext.receiverId,
                  fullName: chatContext.receiverName,
                },
              ],
              lastMessage: res.data.message,
              unreadCounts: {
                [currentUserId]: 0,
              },
            },
            ...prev,
          ];
        });
      }
    } catch (err) {
      console.error("SEND MESSAGE ERROR 👉", err.response?.data || err.message);
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (conversationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this conversation? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:8000/api/messages/conversation/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 1️⃣ Remove conversation immediately
      setConversations((prev) => prev.filter((c) => c._id !== conversationId));

      // 2️⃣ Close chat if it was open
      if (selectedId === conversationId) {
        setSelectedId(null);
        setShowChat(false);
        setMessages([]);
        
      }

      // 3️⃣ 🔥 RE-FETCH applicants / NGOs (single source of truth)
      await fetchApplicants();
    } catch (err) {
      console.error(
        "DELETE CONVERSATION ERROR 👉",
        err.response?.data || err.message,
      );
    }
  };

// Handle navigation state for opening chats (ONE-TIME)
useEffect(() => {
  if (!location.state) return;
  if (navigationHandledRef.current) return;

  navigationHandledRef.current = true;

  const { type, applicationId, receiverId, receiverName } = location.state;

  const existingConversation = conversations.find((conv) =>
    conv.participants.some(
      (p) => String(p._id) === String(receiverId)
    )
  );

  setShowChat(true);

  if (existingConversation) {
    setSelectedId(existingConversation._id);
    setChatContext({
      type: "conversation",
      conversationId: existingConversation._id,
      receiverId,
      receiverName,
    });
  } else {
    setSelectedId(null);
    setChatContext({
      type,
      applicationId,
      receiverId,
      receiverName,
    });
    setMessages([]);
  }

  // 🔥 CLEAR navigation state so Messages page returns to normal mode
  navigate(location.pathname, { replace: true });
}, [location.state, conversations, navigate, location.pathname]);

  /* =========================================================
     5️⃣ SOCKET SETUP & LISTENERS
     ========================================================= */
  // Listen for incoming messages
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    // Handle received message
    const handleReceiveMessage = (message) => {
      const isChatOpen = message.conversationId === selectedId;

      // 1️⃣ If chat is open, append message to right panel
      if (isChatOpen) {
        setMessages((prev) => [...prev, message]);
        // setFirstUnreadIndex(null);
      }

      // 2️⃣ Update left panel conversations
      setConversations((prev) => {
        const exists = prev.some((c) => c._id === message.conversationId);

        // 🔥 CASE 1: FIRST MESSAGE (conversation does not exist)
        if (!exists) {
          return [
            {
              _id: message.conversationId,
              participants: message.conversationParticipants, // ✅ from backend
              lastMessage: message,
              unreadCounts: {
                [currentUserId]: isChatOpen ? 0 : 1,
              },
            },
            ...prev,
          ];
        }

        // 🔥 CASE 2: EXISTING CONVERSATION
        return prev.map((conv) => {
          if (conv._id !== message.conversationId) return conv;
          return {
            ...conv,
            lastMessage: message,
            unreadCounts: message.unreadCounts
              ? message.unreadCounts
              : conv.unreadCounts,
          };
        });
      });
    };
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [selectedId, currentUserId, setConversations]);
  // Listen for conversation updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleConversationUpdated = ({
      conversationId,
      lastMessage,
      unreadCounts,
    }) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c._id === conversationId);

        if (exists) {
          return prev.map((c) =>
            c._id === conversationId ? { ...c, lastMessage, unreadCounts } : c,
          );
        }

        // 🔥 FIRST MESSAGE → ADD CONVERSATION
        return [
          {
            _id: conversationId,
            participants: lastMessage.conversationParticipants,
            lastMessage,
            unreadCounts,
          },
          ...prev,
        ];
      });
    };

    socket.on("conversationUpdated", handleConversationUpdated);

    return () => {
      socket.off("conversationUpdated", handleConversationUpdated);
    };
  }, [setConversations]);
  // Listen for conversation read events
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleConversationRead = ({ conversationId, userId }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId
            ? {
                ...c,
                unreadCounts: {
                  ...c.unreadCounts,
                  [userId]: 0,
                },
              }
            : c,
        ),
      );
    };

    socket.on("conversationRead", handleConversationRead);

    return () => {
      socket.off("conversationRead", handleConversationRead);
    };
  }, [setConversations]);

  /* =========================================================
     6️⃣ FETCH CONVERSATIONS & APPLICANTS
     ========================================================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch conversations
        const convRes = await axios.get(
          "http://localhost:8000/api/conversations",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Fetch applicants / NGOs based on role
        let appRes;
        if (role === "ngo") {
          appRes = await axios.get(
            "http://localhost:8000/api/applications/ngo-applications",
            { headers: { Authorization: `Bearer ${token}` } },
          );
        } else {
          appRes = await axios.get(
            "http://localhost:8000/api/applications/volunteer-applications",
            { headers: { Authorization: `Bearer ${token}` } },
          );
        }

        // Normalize applicants
        const normalizedApplicants = appRes.data.map((app) => {
          if (role === "ngo") {
            return { _id: app._id, user: app.volunteer_id };
          } else {
            return { _id: app._id, user: app.opportunity_id.createdBy };
          }
        });

        // Remove duplicate users
        const uniqueUsersMap = new Map();
        normalizedApplicants.forEach((item) => {
          if (!uniqueUsersMap.has(item.user._id)) {
            uniqueUsersMap.set(item.user._id, item);
          }
        });
        // Collect userIds that already have conversations
        const conversationUserIds = convRes.data
          .map((conv) => {
            const otherUser = conv.participants.find(
              (p) => p._id !== currentUserId,
            );
            return otherUser?._id;
          })
          .filter(Boolean);

        const dedupedApplicants = Array.from(uniqueUsersMap.values()).filter(
          (app) => !conversationUserIds.includes(app.user._id),
        );

        setApplicants(dedupedApplicants);

        setConversations(convRes.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchData();
  }, [role, currentUserId, setConversations]);

  /* =========================================================
     7️⃣ FETCH MESSAGES WHEN CONVERSATION IS SELECTED
     ========================================================= */
  useEffect(() => {
    if (!selectedId) return;

    const isConversation = conversations.some((c) => c._id === selectedId);
    if (!isConversation) return;

    // Fetch messages
    fetchMessages(selectedId);

    // Join socket room
    const socket = getSocket();
    socket?.emit("joinConversation", selectedId);
  }, [selectedId, conversations]);
  // Listen for conversation deletions
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleConversationDeleted = ({ conversationId }) => {
      // 1️⃣ Remove conversation
      setConversations((prev) => prev.filter((c) => c._id !== conversationId));

      // 2️⃣ Close chat if it was open
      if (chatContext?.conversationId === conversationId) {
        setChatContext(null);
        setShowChat(false);
        setMessages([]);
      }
    };

    socket.on("conversationDeleted", handleConversationDeleted);

    return () => {
      socket.off("conversationDeleted", handleConversationDeleted);
    };
  }, [chatContext, setConversations, fetchApplicants]);

  useEffect(() => {
    fetchApplicants();
  }, [conversations, fetchApplicants]);

  /* =========================================================
     8️⃣ JSX RENDER
     ========================================================= */
  return (
    <div className="flex flex-1 bg-[#eef7f9] overflow-hidden">
      {/* MAIN HORIZONTAL LAYOUT */}
      <div className=" flex flex-1  h-full min-h-0 overflow-hidden">
        {/* ================= LEFT PANEL ================= */}
        <div className="w-[300px] bg-white border-r border-gray-200 shadow-[4px_0_10px_-6px_rgba(0,0,0,0.1)] flex flex-col pl-2 min-h-0 overflow-hidden">
          {/* LEFT HEADER */}
          <div className="items-center justify-between px-4 py-3 border-b shrink-0">
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>

            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-3 w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e262b]"
            />
          </div>

          {/* LEFT SCROLL AREA */}
          <div className="flex-1 overflow-y-auto px-2 space-y-2 min-h-0"> 
            {/* MESSAGES */}
            <p className="px-2 py-2 text-sm font-regular text-[#1f3a5f] opacity-4 uppercase bg-gray-100">
              Messages
            </p>

            {filteredConversations.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-400">
                No conversations yet
              </p>
            )}

            {filteredConversations.map((conv) => {
              console.log("DEBUG CONV:", {
                convId: conv._id,
                unreadCounts: conv.unreadCounts,
                currentUserId,
              });

              const unread = conv.unreadCounts?.[currentUserId] || 0;

              const otherUser = conv.participants.find(
                (p) => p._id !== currentUserId,
              );
              const isActive = selectedId === conv._id;

              return (
                <div
                  key={conv._id}
                  onClick={(e) => {
                    e.stopPropagation();

                    if (!conv?._id) return;

                    setSelectedId(conv._id);
                    setShowChat(true);
                    setMessages([]); // ✅ keep this
                    fetchMessages(conv._id);
                    setChatContext({
                      type: "conversation",
                      conversationId: conv._id,
                      receiverId: otherUser?._id,
                      receiverName: otherUser?.fullName,
                    });

                    //🔵 RESET UNREAD COUNT (ONLY FOR CONVERSATIONS)
                    const token = localStorage.getItem("token");

                    axios.patch(
                      `http://localhost:8000/api/messages/conversation/${conv._id}/read`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      },
                    );
                    setConversations((prev) =>
                      prev.map((c) =>
                        c._id === conv._id
                          ? {
                              ...c,
                              unreadCounts: {
                                ...c.unreadCounts,
                                [currentUserId]: 0,
                              },
                            }
                          : c,
                      ),
                    );
                  }}
                  // 🔵 UPDATE UI STATE IMMEDIATELY

                  className={`group px-3 py-2 rounded-lg mb-1 cursor-pointer transition
                  ${isActive ? "bg-[#7fd0d8]/30" : "hover:bg-[#7fd0d8]/20"}
                `}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {otherUser?.fullName}
                      </p>
                      <FiTrash2
                        className="text-red-500 opacity-0 group-hover:opacity-100"
                        size={14}
                        onClick={(e) => {
                          e.stopPropagation(); //prevent opening chat
                          handleDeleteConversation(conv._id);
                          setChatContext(null);
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 truncate">
                        {conv.lastMessage?.text || "Click to message"}
                      </p>
                      {unread > 0 && (
                        <span
                          className="
      w-4 h-4
      bg-[#1f3a5f]
      text-white
      text-[10px] font-semibold
      rounded-full
      flex items-center justify-center
      flex-shrink-0
    "
                        >
                          {unread > 6 ? "6+" : unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* APPLICANTS */}
            <p className="px-2 pt-4 pb-2 text-sm font-regular text-[#1f3a5f] opacity-4 ">
              {role === "ngo" ? "APPLICANTS" : "NGO's"}
            </p>

            {filteredApplicants.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-400">
                {role === "ngo" ? " No applicants" : "No NGOs"}
              </p>
            )}

            {filteredApplicants.map((app) => {
              const isActive = selectedId === app._id;

              return (
                <div
                  key={app.applicationId}
                  onClick={() => {
                    console.log("APPLICANT CLICKED:", app);
                    setSelectedId(null); // 🔥 IMPORTANT
                    setChatContext({
                      type: "application",
                      applicationId: app.applicationId,
                      receiverId: app.user._id,
                      receiverName: app.user.fullName,
                    });

                    setMessages([]);
                    setShowChat(true);
                  }}
                  className={`px-3 py-2 rounded-lg mb-1 cursor-pointer transition
                  ${isActive ? "bg-[#7fd0d8]/30" : "hover:bg-[#7fd0d8]/20"}
                `}
                >
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {app.user.fullName}
                  </p>
                  <p className="text-xs text-gray-500">Click to message</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="flex-1 flex flex-col bg-[#eef7f9] min-h-0 overflow-hidden">
          <div className="flex-1 p-4 flex min-h-0">
             <div className="flex flex-col flex-1 bg-white rounded-xl border shadow-mdmin-h-0 overflow-hidden"> 
            
              {/* ================= EMPTY STATE OR CHAT ================= */}
              {!showChat ? (
                /* ========== EMPTY STATE ========== */
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <p className="text-lg font-medium mb-2">
                      Select a conversation
                    </p>
                    <p className="text-sm mt-1">
                      Choose a conversation or start a new one to begin
                      messaging
                    </p>
                  </div>
                </div>
              ) : (
                /* ========== CHAT UI ========== */
                <>
                  {/* RIGHT HEADER */}
                  <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
                               <div className="flex items-center gap-2">
  <button
    onClick={closeChat}
    className="text-gray-500 hover:text-gray-800"
    title="Back"
  >
    <FiArrowLeft size={20} />
  </button>
                      <div className="w-10 h-10 rounded-full bg-[#1f3a5f] flex items-center justify-center text-white font-semibold">
                        {chatContext?.receiverName
                          ? chatContext.receiverName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                          : "?"}
                      </div>

                      <p className="font-semibold text-gray-800">
                        {chatContext?.receiverName || "Unknown User"}
                      </p>
                    </div>

                    <FiTrash2
                      className="text-red-500 cursor-pointer"
                      size={18}
                      onClick={() => {
                        if (!selectedId) return;
                        handleDeleteConversation(selectedId);
                        setChatContext(null);
                      }}
                    />
                  </div>

                  {/* MESSAGES SCROLL */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 bg-[#f7fbfc] space-y-4 min-h-0">
                    {loadingMessages && (
                      <p className="text-sm text-gray-400 text-center mt-4">
                        Loading messages...
                      </p>
                    )}

                    {!loadingMessages && messages.length === 0 && (
                      <p className="text-sm text-gray-400 text-center mt-4">
                        No messages yet
                      </p>
                    )}

                    {messages.map((msg) => {
                      const isMine = msg.senderId === currentUserId;

                      return (
                        <React.Fragment key={msg._id}>
                          <div
                            className={`flex ${
                              isMine ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div className="max-w-[70%]">
                              <div
                                className={`px-4 py-2 rounded-2xl text-sm
              ${
                isMine
                  ? "bg-[#7fd0d8] text-gray-900 rounded-br-none"
                  : "bg-white border text-gray-800 rounded-bl-none"
              }
            `}
                              >
                                {msg.text}
                              </div>
                              <p className={`mt-1 text-xs text-gray-400 ${ isMine ? "text-right" : "text-left" }`}>
                                {new Date(msg.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* INPUT FIXED */}
                  <div className="border-t px-4 py-3 flex items-center gap-3 shrink-0">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-3 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-[#7fd0d8]"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={
                        !chatContext ||
                        (chatContext.type === "application" &&
                          (!chatContext.applicationId ||
                            !chatContext.receiverId)) ||
                        (chatContext.type === "conversation" &&
                          !chatContext.conversationId)
                      }
                      className={`px-6 py-3 rounded-full font-medium text-white
    ${
      !chatContext ||
      (chatContext.type === "application" &&
        (!chatContext.applicationId || !chatContext.receiverId)) ||
      (chatContext.type === "conversation" && !chatContext.conversationId)
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-[#7fd0d8] hover:opacity-90"
    }`}
                    >
                      <FiSend size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}