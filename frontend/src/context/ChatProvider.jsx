import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { getSocket } from "../socket";
import { connectSocket } from "../socket";

import ChatContext from "./ChatContext";

const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        "http://localhost:8000/api/conversations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConversations(res.data);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    }
  };

  fetchConversations();
}, [setConversations]);

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  connectSocket(user);
}, []);

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
          c._id === conversationId
            ? { ...c, lastMessage, unreadCounts }
            : c
        );
      }

      // First message case
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


  return (
    <ChatContext.Provider value={{ conversations, setConversations }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
