import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdSend, MdAttachFile, MdArrowBack } from "react-icons/md";
import socket from "../socket";

function Messages() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  // Get auth data
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = userData.id;
  const token = localStorage.getItem("token");
  const userRole = userData.role;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState(null);

  const bottomRef = useRef(null);

  // Check if user is authenticated
  const isAuthenticated = token && currentUserId;

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load application details
  useEffect(() => {
    if (!applicationId || !isAuthenticated) return;

    axios
      .get(`http://localhost:4001/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setApplication(res.data);
      })
      .catch((err) => {
        console.error("Error loading application:", err);
      });
  }, [applicationId, token, isAuthenticated]);

  // Load messages 
  useEffect(() => {
    if (!applicationId || !isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    
    axios
      .get(`http://localhost:4001/api/messages/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessages(res.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading messages:", err);
        setIsLoading(false);
        if (err.response?.status === 403) {
          setError("Unauthorized access. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setError("Failed to load messages");
        }
      });
  }, [applicationId, token, isAuthenticated]);

  // Socket connection
  useEffect(() => {
    if (!applicationId || !isAuthenticated) return;

    socket.connect();
    socket.emit("join-chat", { applicationId });

    const handleReceiveMessage = (msg) => {
      const msgSenderId = String(msg.senderId);
      const userId = String(currentUserId);
      
      if (msgSenderId !== userId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.emit("leave-chat", { applicationId });
      socket.off("receive-message", handleReceiveMessage);
      socket.disconnect();
    };
  }, [applicationId, currentUserId, isAuthenticated]);

  // Send message
  const sendMessage = useCallback(async () => {
    if (!text.trim() || !applicationId || !isAuthenticated) return;

    try {
      const res = await axios.post(
        "http://localhost:4001/api/messages",
        { applicationId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, res.data]);

      socket.emit("send-message", {
        applicationId,
        senderId: res.data.senderId,
        text: res.data.text,
        time: new Date(res.data.createdAt).toLocaleTimeString(),
      });

      setText("");
    } catch (err) {
      console.error("Error sending message:", err);
      if (err.response?.status === 403) {
        setError("Unauthorized. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [text, applicationId, token, isAuthenticated]);

  const isCurrentUser = (senderId) => {
    if (!senderId || !currentUserId) return false;
    return String(senderId) === String(currentUserId);
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Get the display name for the chat header
  const getChatName = () => {
    if (!application) return "Chat";
    
    if (userRole === "ngo") {
      return application.volunteer?.fullName || application.volunteer?.name || "Volunteer";
    } 
    
    const ngoData = application.opportunity?.ngo;
    if (ngoData) {
      return ngoData.organizationName || ngoData.fullName || ngoData.name || "NGO";
    }
    
    return application.opportunity?.title || "Chat";
  };

  // Get avatar initial
  const getAvatarInitial = () => {
    const name = getChatName();
    return name.charAt(0).toUpperCase();
  };

  // Show empty state when no applicationId
  if (!applicationId) {
    return (
      <div className="flex flex-col h-full bg-slate-50">

        {/* HEADER */}
        <div className="h-16 bg-white flex items-center px-4 border-b border-slate-200 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-lg font-semibold text-slate-800">Messages</p>
            <p className="text-xs text-slate-500">Select a conversation</p>
          </div>
        </div>

        {/* EMPTY STATE */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 mb-4 rounded-2xl bg-orange-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Your messages</h3>
          <p className="text-slate-500 text-center text-sm max-w-xs">
            Select a conversation from the sidebar to start chatting.
          </p>
        </div>

        {/* INPUT (disabled) */}
        <div className="bg-white px-4 py-4 border-t border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <MdAttachFile className="h-5 w-5" />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Select a conversation"
              disabled
              className="flex-1 px-3 py-1 bg-transparent border-none outline-none text-slate-400 cursor-not-allowed text-sm"
            />
            <button
              disabled
              className="p-2.5 bg-slate-200 text-slate-400 rounded-full cursor-not-allowed"
            >
              <MdSend className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* HEADER */}
      <div className="h-16 bg-white flex items-center px-4 border-b border-slate-200 flex-shrink-0">
        <button 
          onClick={() => navigate("/messages")}
          className="mr-3 p-2 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
        >
          <MdArrowBack className="h-5 w-5 text-slate-600" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md flex-shrink-0">
          {getAvatarInitial()}
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{getChatName()}</p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <p className="text-xs text-slate-500">Online</p>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {error && (
          <div className="text-center py-3">
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm inline-block border border-red-100">
              {error}
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-slate-500">No messages yet</p>
            <p className="text-xs text-slate-400">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, i, arr) => {
            const isMe = isCurrentUser(msg.senderId);
            const showDate = i === 0 || formatDate(msg.createdAt) !== formatDate(arr[i-1]?.createdAt);
            const prevMsg = arr[i-1];
            const showTime = !prevMsg || 
              new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() > 60000;

            return (
              <div key={msg._id || i}>
                {showDate && (
                  <div className="flex items-center justify-center my-3">
                    <span className="text-xs text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl relative ${
                      isMe 
                        ? "bg-orange-500 text-white rounded-br-md" 
                        : "bg-white text-slate-800 rounded-bl-md border border-slate-200"}`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div className={`text-[10px] mt-1 flex items-center gap-1 ${isMe ? "text-orange-100" : "text-slate-400"}`}>
                      {showTime && <span>{formatTime(msg.createdAt)}</span>}
                      {isMe && (
                        <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="bg-white px-4 py-4 border-t border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2.5 focus-within:bg-slate-50 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
          {/* Attachment Button */}
          <button className="p-2 text-slate-400 hover:text-orange-500 hover:bg-white rounded-full transition-colors">
            <MdAttachFile className="h-5 w-5" />
          </button>
          
          {/* Message Input */}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-sm"
          />
          
          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className={`p-2.5 rounded-full transition-all ${
              text.trim() 
                ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <MdSend className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Messages;

