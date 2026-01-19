import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdSend, MdInsertEmoticon, MdAttachFile, MdArrowBack } from "react-icons/md";
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
        console.log("Application data:", res.data);
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
          // Clear invalid token and user data
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

    // Handle incoming 
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
      
      // Disconnect socket 
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

      // Add message 
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
    
    // For NGO: show volunteer name
    if (userRole === "ngo") {
      return application.volunteer?.fullName || application.volunteer?.name || "Volunteer";
    } 
    
    // For Volunteer: show NGO name
    // Check different possible paths for NGO name
    const ngoData = application.opportunity?.ngo;
    if (ngoData) {
      return ngoData.organizationName || ngoData.fullName || ngoData.name || "NGO";
    }
    
    // Fallback: try to get from opportunity title
    return application.opportunity?.title || "Chat";
  };

  // Get avatar initial
  const getAvatarInitial = () => {
    const name = getChatName();
    return name.charAt(0).toUpperCase();
  };

  // Debug - log application data structure
  useEffect(() => {
    if (application) {
      console.log("Application full data:", JSON.stringify(application, null, 2));
    }
  }, [application]);

  if (!applicationId) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100 relative">

        {/* HEADER */}
        <div className="h-16 bg-white flex items-center px-6 border-b shadow-sm absolute top-0 left-0 right-0 z-20">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-lg font-semibold text-gray-800">Messages</p>
            <p className="text-sm text-gray-500">Select a conversation to start messaging</p>
          </div>
        </div>

        {/* EMPTY STATE */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 pt-20">
          <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Your messages</h3>
          <p className="text-gray-500 text-center max-w-md">
            Select a conversation from the sidebar to start chatting with volunteers or NGOs.
          </p>
        </div>

        {/* INPUT (disabled) */}
        <div className="bg-white px-4 py-4 border-t shadow-lg absolute bottom-0 left-0 right-0 z-20">
          <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-2.5">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <MdAttachFile className="h-5 w-5" />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Select a conversation"
              disabled
              className="flex-1 px-4 py-2 bg-transparent border-none outline-none text-gray-500 cursor-not-allowed"
            />
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <MdInsertEmoticon className="h-5 w-5" />
            </button>
            <button
              onClick={sendMessage}
              disabled
              className="p-2.5 bg-gray-200 text-gray-400 rounded-full cursor-not-allowed"
            >
              <MdSend className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-50/50 to-gray-50">
      {/* HEADER */}
      <div className="h-16 bg-white flex items-center px-4 border-b shadow-sm flex-shrink-0">
        <button 
          onClick={() => navigate("/messages")}
          className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
        >
          <MdArrowBack className="h-5 w-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold shadow-md">
          {getAvatarInitial()}
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold text-gray-800">{getChatName()}</p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {error && (
          <div className="text-center py-3">
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm inline-block border border-red-100">
              {error}
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400">Start the conversation!</p>
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
                  <div className="flex items-center justify-center my-4">
                    <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm relative
                    ${isMe 
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-md" 
                      : "bg-white text-gray-800 rounded-bl-md"}`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div className={`text-[10px] mt-1 flex items-center gap-1 ${isMe ? "text-orange-100" : "text-gray-400"}`}>
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
      <div className="bg-white px-4 py-4 border-t shadow-lg flex-shrink-0">
        <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2.5 focus-within:bg-gray-50 focus-within:ring-2 focus-within:ring-orange-200 transition-all shadow-sm">
          {/* Attachment Button */}
          <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-white rounded-full transition-colors">
            <MdAttachFile className="h-5 w-5" />
          </button>
          
          {/* Message Input */}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
          />
          
          
          
          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className={`p-2.5 rounded-full transition-all ${
              text.trim() 
                ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
