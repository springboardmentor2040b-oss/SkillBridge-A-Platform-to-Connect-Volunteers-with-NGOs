import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Messages() {
  const navigate = useNavigate();

  /* ✅ GET ROLE FROM LOGIN / SIGNUP */
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.role); // volunteer / ngo
    }
  }, []);

  /* ✅ CONVERSATIONS DATA */
  const [conversations] = useState([
    {
      id: 1,
      name: "Green Earth NGO",
      role: "NGO",
      last: "Can you help with our website updates?",
      date: "May 10",
      messages: [
        {
          from: "them",
          text: "Hi! We saw your profile and liked your web skills.",
          time: "10:30 AM",
        },
        {
          from: "them",
          text: "Can you help with our website updates?",
          time: "10:31 AM",
        },
      ],
    },
    {
      id: 2,
      name: "EduCare Foundation",
      role: "NGO",
      last: "Thanks for applying!",
      date: "May 9",
      messages: [
        {
          from: "them",
          text: "Thanks for applying to our teaching opportunity.",
          time: "6:20 PM",
        },
      ],
    },
  ]);

  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  /* ✅ SEND MESSAGE HANDLER */
  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      from: "me",
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setActiveChat((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));

    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔵 TOP NAVBAR */}
      <nav className="bg-blue-600 text-white px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <Logo size={28} textColor="white" />
            
          </div>

          <div className="hidden md:flex gap-6 text-sm">
            <span
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer hover:underline"
            >
              Dashboard
            </span>
            <span
              onClick={() => navigate("/opportunities")}
              className="cursor-pointer hover:underline"
            >
              Opportunities
            </span>
            <span
              onClick={() => navigate("/applications")}
              className="cursor-pointer hover:underline"
            >
              Applications
            </span>
            <span className="font-semibold underline">Messages</span>
          </div>
        </div>

        {/* ✅ DYNAMIC ROLE BADGE */}
        <div className="bg-blue-700 px-4 py-1 rounded-full text-sm capitalize">
          {userRole || "User"}
        </div>
      </nav>

      {/* 💬 MESSAGES LAYOUT */}
      <div className="flex h-[calc(100vh-72px)]">
        {/* LEFT – CONVERSATIONS */}
        <aside className="w-full md:w-1/3 bg-white border-r p-4 overflow-y-auto">
          <h2 className="font-semibold mb-4">Messages</h2>

          <input
            placeholder="Search conversations..."
            className="w-full px-3 py-2 border rounded-lg mb-4"
          />

          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveChat(c)}
              className={`p-3 rounded-lg cursor-pointer mb-2 ${
                activeChat.id === c.id
                  ? "bg-blue-50"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.role}</p>
                </div>
                <span className="text-xs text-gray-400">{c.date}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 truncate">
                {c.last}
              </p>
            </div>
          ))}
        </aside>

        {/* RIGHT – CHAT */}
        <main className="flex-1 flex flex-col bg-white">
          {/* CHAT HEADER */}
          <div className="border-b px-6 py-4">
            <h3 className="font-semibold">{activeChat.name}</h3>
            <p className="text-xs text-gray-500">{activeChat.role}</p>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-6 overflow-y-auto space-y-3">
            {activeChat.messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-fit px-4 py-2 rounded-2xl text-sm break-words whitespace-pre-wrap ${
                  m.from === "me"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{m.text}</p>
                <span className="block text-xs opacity-70 mt-1 text-right">
                  {m.time}
                </span>
              </div>
            ))}
          </div>

          {/* INPUT */}
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
