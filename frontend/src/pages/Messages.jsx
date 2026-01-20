import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import socket from "../services/socket";
import API from "../services/api";

export default function Messages() {
  const navigate = useNavigate();

  // ✅ SINGLE SOURCE OF TRUTH
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return null; // safety
  }

  // ✅ ROLE-BASED ONE-TO-ONE CHAT
  const conversation =
    currentUser.role === "volunteer"
      ? {
          _id: "696f275fccfeb1e629001b73", // Helping Hands NGO (REAL ID)
          name: "Helping Hands NGO",
          role: "ngo",
        }
      : {
          _id: "69693ec66901731d8e81f2da", // Volunteer (REAL ID)
          name: "user",
          role: "volunteer",
        };

  const [activeChat] = useState(conversation);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  /* 🔌 SOCKET */
  useEffect(() => {
    socket.connect();
    socket.emit("join", currentUser._id);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [currentUser._id]);

  /* 📥 LOAD CHAT HISTORY */
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await API.get(`/messages/${activeChat._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Load messages failed", err);
      }
    };

    loadMessages();
  }, [activeChat._id]);

  /* 📤 SEND MESSAGE */
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await API.post("/messages", {
        receiverId: activeChat._id,
        content: newMessage,
      });

      const savedMessage = res.data;

      socket.emit("sendMessage", {
        sender_id: savedMessage.sender_id,
        receiver_id: savedMessage.receiver_id,
        content: savedMessage.content,
        createdAt: savedMessage.createdAt,
      });

      setMessages((prev) => [...prev, savedMessage]);
      setNewMessage("");
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAV — UNCHANGED */}
      <nav className="bg-blue-600 text-white px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <Logo size={28} textColor="white" />
          </div>

          <div className="hidden md:flex gap-6 text-sm">
            <span onClick={() => navigate("/dashboard")} className="cursor-pointer hover:underline">
              Dashboard
            </span>
            <span onClick={() => navigate("/opportunities")} className="cursor-pointer hover:underline">
              Opportunities
            </span>
            <span onClick={() => navigate("/applications")} className="cursor-pointer hover:underline">
              Applications
            </span>
            <span className="font-semibold underline">Messages</span>
          </div>
        </div>

        <div className="bg-blue-700 px-4 py-1 rounded-full text-sm capitalize">
          {currentUser.role}
        </div>
      </nav>

      {/* CHAT */}
      <div className="flex h-[calc(100vh-72px)]">
        <aside className="w-full md:w-1/3 bg-white border-r p-4">
          <h2 className="font-semibold mb-4">Messages</h2>

          <div className="p-3 rounded-lg bg-blue-50">
            <p className="font-medium">{activeChat.name}</p>
            <p className="text-sm text-gray-500 capitalize">
              {activeChat.role}
            </p>
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-white">
          <div className="border-b px-6 py-4">
            <h3 className="font-semibold">{activeChat.name}</h3>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-fit px-4 py-2 rounded-2xl text-sm ${
                  m.sender_id === currentUser._id
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.content}
              </div>
            ))}
          </div>

          <div className="border-t p-4 flex gap-3">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-4 py-2"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
