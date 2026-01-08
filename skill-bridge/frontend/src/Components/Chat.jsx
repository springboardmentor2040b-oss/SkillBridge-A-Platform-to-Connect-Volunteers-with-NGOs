import React, { useState } from "react";
import "./Chat.css";

const conversationsData = [
  {
    id: 1,
    name: "Test NGO",
    lastMessage: "Hello! I noticed you have web development skills...",
    messages: [
      {
        sender: "ngo",
        text: "Hello! I noticed you have web development skills. We're looking for help with our Translation of Educational Materials project. Would you be interested?",
        time: "May 8, 6:47 PM"
      },
      {
        sender: "ngo",
        text: "Great! We primarily need translations in Spanish and French. Do you have availability in the coming weeks?",
        time: "May 8, 6:47 PM"
      }
    ]
  },
  {
    id: 2,
    name: "NYC Animal Rescue",
    lastMessage: "Hello! I'm interested in your Website Redesign project...",
    messages: [
      {
        sender: "ngo",
        text: "Hello! I'm interested in your Website Redesign project. I have experience with responsive design.",
        time: "May 8, 5:30 PM"
      }
    ]
  }
];

const Chat = () => {
  const [conversations, setConversations] = useState(conversationsData);
  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      sender: "user",
      text: message,
      time: "Just now"
    };

    const updated = conversations.map((c) =>
      c.id === activeChat.id
        ? { ...c, messages: [...c.messages, newMsg] }
        : c
    );

    setConversations(updated);
    setActiveChat(updated.find((c) => c.id === activeChat.id));
    setMessage("");
  };

  return (
    <div className="chat-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <input type="text" placeholder="Search conversations..." />
        {conversations.map((c) => (
          <div
            key={c.id}
            className={`chat-user ${
              activeChat.id === c.id ? "active" : ""
            }`}
            onClick={() => setActiveChat(c)}
          >
            <h4>{c.name}</h4>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-header">{activeChat.name}</div>

        <div className="messages">
          {activeChat.messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === "user" ? "user" : "ngo"
              }`}
            >
              <p>{msg.text}</p>
              <span>{msg.time}</span>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
