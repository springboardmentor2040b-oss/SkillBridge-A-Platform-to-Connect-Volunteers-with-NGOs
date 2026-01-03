import React, { useState } from "react";

const conversationsMock = [
  {
    id: 1,
    name: "Test NGO",
    role: "NGO",
    lastMessage: "Hello! I noticed you have web development skills...",
    date: "3/1/2026",
    messages: [
      {
        sender: "ngo",
        text: "Hello! I noticed you have web development skills. We're looking for help with our Translation of Educational Materials project. Would you be interested?",
        time: "Jan 3, 12:10 PM"
      },
      {
        sender: "user",
        text: "Yes, I’d be happy to help!",
        time: "Jan 3, 12:10 PM"
      },
      {
        sender: "ngo",
        text: "Great! We primarily need translations in Spanish and French, but if you have experience with other languages, that would be helpful too. Do you have availability in the coming weeks?",
        time: " Jan 3, 12:12 PM"
      }
    ]
  },
  {
    id: 2,
    name: "NYC Animal Rescue",
    role: "NGO",
    lastMessage: "Hello! I'm interested in your Website Redesign project...",
    date: "3/1/2026",
    messages: []
  }
];

function Messages() {
  const [conversations, setConversations] = useState(conversationsMock);
  const [activeChat, setActiveChat] = useState(conversationsMock[0]);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;

    const updatedChat = {
      ...activeChat,
      messages: [
        ...activeChat.messages,
        {
          sender: "user",
          text: message,
          time: new Date().toLocaleString()
        }
      ]
    };

    setActiveChat(updatedChat);
    setConversations(conversations.map(c => c.id === updatedChat.id ? updatedChat : c));
    setMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      <div className="flex h-[600px] bg-white border rounded-xl overflow-hidden">

        {/* LEFT SIDEBAR */}
        <div className="w-1/3 border-r p-4">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full mb-4 px-3 py-2 border rounded-md"
          />

          <div className="space-y-3">
            {conversations.map(chat => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`p-3 rounded-md cursor-pointer ${
                  activeChat.id === chat.id ? "bg-oran-100" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{chat.name}</h3>
                    <p className="text-xs text-gray-500">{chat.role}</p>
                  </div>
                  <span className="text-xs text-gray-400">{chat.date}</span>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {chat.lastMessage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className="w-2/3 flex flex-col">

          {/* CHAT HEADER */}
          <div className="border-b p-4">
            <h2 className="font-semibold">{activeChat.name}</h2>
            <p className="text-xs text-gray-500">{activeChat.role}</p>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {activeChat.messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[70%] p-3 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "ml-auto bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{msg.text}</p>
                <span className="block text-xs mt-1 opacity-70">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="border-t p-4 flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <button
              onClick={sendMessage}
              className="px-5 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Send
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Messages;
