import React, { useEffect, useState } from "react";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [message, setMessage] = useState(""); // Pour les erreurs ou messages d'information

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      setMessage(""); // Effacer tout message précédent en cas de succès
    } catch (error) {
      setMessage("Erreur : impossible de charger les discussions.");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      style={{
        display: "flex", // Toujours visible
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        border: "1px solid #ddd",
      }}
    >
      {/* En-tête */}
      <div
        style={{
          marginBottom: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: "0",
          }}
        >
My Discussions        </h3>
        <GroupChatModal>
          <button
            style={{
              fontSize: "14px",
              backgroundColor: "#4caf50",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
Create a Group          </button>
        </GroupChatModal>
      </div>

      {/* Messages d'erreur */}
      {message && (
        <div
          style={{
            color: "red",
            fontSize: "14px",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      {/* Liste des discussions */}
      <div
        style={{
          flex: 1,
          width: "100%",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        {chats ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedChat === chat ? "#38B2AC" : "#fff",
                color: selectedChat === chat ? "white" : "black",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "8px",
                border: selectedChat === chat ? "none" : "1px solid #ddd",
                boxShadow:
                  selectedChat === chat ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
              }}
            >
              <div>
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </div>
              {chat.latestMessage && (
                <div
                  style={{
                    fontSize: "12px",
                    color: selectedChat === chat ? "#f1f1f1" : "#555",
                    marginTop: "5px",
                  }}
                >
                  <strong>{chat.latestMessage.sender.name}:</strong>{" "}
                  {chat.latestMessage.content.length > 50
                    ? chat.latestMessage.content.substring(0, 50) + "..."
                    : chat.latestMessage.content}
                </div>
              )}
            </div>
          ))
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
