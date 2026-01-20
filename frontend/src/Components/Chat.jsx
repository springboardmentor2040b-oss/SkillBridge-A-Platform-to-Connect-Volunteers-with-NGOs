import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import socket from "../socket";
import "./Chat.css";

const Chat = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const [searchParams] = useSearchParams();

  const ngoId = searchParams.get("ngo");
  const volunteerId = searchParams.get("volunteer");

  const [inbox, setInbox] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");
  const bottomRef = useRef();


  /* =====================================================
     LOAD INBOX (WHATSAPP STYLE) WHEN OPENED FROM DASHBOARD
  ===================================================== */
  useEffect(() => {

    fetch(`http://localhost:5000/api/chat/user/${user._id}`)
      .then(res => res.json())
      .then(data => {

        const rooms = {};

        data.forEach(msg => {

          if (!rooms[msg.roomId]) {

            rooms[msg.roomId] = {
              roomId: msg.roomId,
              ngoId: msg.ngoId,
              volunteerId: msg.volunteerId,

              lastText: msg.text,
              lastTime: msg.time,

              name:
                user.userType === "NGO"
                  ? msg.senderType === "Volunteer"
                    ? msg.senderName
                    : "Volunteer"
                  : msg.senderType === "NGO"
                    ? msg.senderName
                    : "NGO"
            };

          } else {

            rooms[msg.roomId].lastText = msg.text;
            rooms[msg.roomId].lastTime = msg.time;

          }

        });

        setInbox(Object.values(rooms));

      });

  }, [user._id]);


  /* =====================================================
     IF COMING FROM APPLICATION PAGE → OPEN DIRECTLY
  ===================================================== */
  useEffect(() => {

    if (ngoId && volunteerId) {

      const roomId = `room_${ngoId}_${volunteerId}`;

      const chatObj = {
        roomId,
        ngoId,
        volunteerId
      };

      openChat(chatObj);
    }

  }, [ngoId, volunteerId]);


  /* =====================================================
     OPEN CHAT FUNCTION
  ===================================================== */
  const openChat = (chat) => {

    setSelected(chat);

    socket.emit("joinRoom", chat.roomId);

    fetch(`http://localhost:5000/api/chat/${chat.roomId}`)
      .then(res => res.json())
      .then(data => {

        if (!data || data.length === 0) {

          setMessages([
            {
              system: true,
              text:
                user.userType === "NGO"
                  ? "Start conversation with this volunteer"
                  : "Start conversation with this NGO",
            }
          ]);

        } else {
          setMessages(data);
        }

      });
  };


  /* =====================================================
     RECEIVE LIVE MESSAGES
  ===================================================== */
  useEffect(() => {

    socket.on("receiveMessage", (msg) => {

      // update inbox preview
      setInbox(prev => {

        const others =
          prev.filter(p => p.roomId !== msg.roomId);

        const updated = {
          roomId: msg.roomId,
          ngoId: msg.ngoId,
          volunteerId: msg.volunteerId,

          lastText: msg.text,
          lastTime: msg.time,

          name:
            user.userType === "NGO"
              ? msg.senderType === "Volunteer"
                ? msg.senderName
                : "Volunteer"
              : msg.senderType === "NGO"
                ? msg.senderName
                : "NGO"
        };

        return [updated, ...others];
      });


      // if current chat open
      if (selected && msg.roomId === selected.roomId) {

        setMessages(prev =>
          prev.filter(m => !m.system).concat(msg)
        );

        setTimeout(() =>
          bottomRef.current?.scrollIntoView({
            behavior: "smooth"
          }), 100
        );
      }

    });

    return () => socket.off("receiveMessage");

  }, [selected, user.userType]);


  /* =====================================================
     SEND MESSAGE
  ===================================================== */
  const sendMessage = () => {

    if (!message.trim() || !selected) return;

    const data = {

      roomId: selected.roomId,

      senderId: user._id,

      senderName:
        user.userType === "NGO"
          ? user.organizationName
          : user.fullName,

      senderType: user.userType,

      ngoId: selected.ngoId,
      volunteerId: selected.volunteerId,

      text: message,
      time: new Date().toLocaleTimeString(),

    };

    socket.emit("sendMessage", data);

    setMessage("");
  };


  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="chat-layout">

      {/* ===== LEFT INBOX (ONLY DASHBOARD MODE) ===== */}
      {!ngoId && !volunteerId && (

        <div className="chat-list">

          <h3>Messages</h3>

          {inbox.length === 0 && (
            <p>No conversations yet</p>
          )}

          {inbox.map((chat, i) => (

            <div
              key={i}
              className={
                selected?.roomId === chat.roomId
                  ? "chat-user active"
                  : "chat-user"
              }
              onClick={() => openChat(chat)}
            >

              <div className="chat-name">
                {chat.name}
              </div>

              <div className="chat-preview">
                {chat.lastText?.slice(0, 20)}...
              </div>

              <div className="chat-time">
                {chat.lastTime}
              </div>

            </div>

          ))}

        </div>
      )}


      {/* ===== RIGHT CHAT BOX ===== */}
      <div className="chat-box">

        {!selected ? (

          <div className="empty">
            Select a person to start chat
          </div>

        ) : (

          <>
            <div className="chat-header">
              {user.userType === "NGO"
                ? "Volunteer"
                : "NGO"}
            </div>

            <div className="chat-messages">

              {messages.map((msg, i) => (

                msg.system ? (

                  <div key={i} className="system-msg">
                    {msg.text}
                  </div>

                ) : (

                  <div
                    key={i}
                    className={
                      msg.senderId === user._id
                        ? "bubble me"
                        : "bubble other"
                    }
                  >

                    <div className="sender">
                      {msg.senderName}
                    </div>

                    <div>{msg.text}</div>

                    <div className="time">
                      {msg.time}
                    </div>

                  </div>

                )
              ))}

              <div ref={bottomRef}></div>

            </div>


            <div className="chat-input-bar">

              <input
                value={message}
                onChange={e =>
                  setMessage(e.target.value)
                }
                placeholder="Type message..."
              />

              <button onClick={sendMessage}>
                Send
              </button>

            </div>

          </>
        )}

      </div>
    </div>
  );
};

export default Chat;
