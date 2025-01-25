import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ENDPOINT = "http://localhost:5000"; // Remplacez par l'URL de votre backend déployé
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, user } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { notification, setNotification } = ChatState();

  // Fonction pour récupérer les messages
  const fetchMessages = async () => {
    if (!selectedChat) return;

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      // Rejoindre la salle de chat via Socket.io
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Erreur lors du chargement des messages :", error);
      setLoading(false);
    }
  };

  // Fonction pour envoyer un message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/message/`,
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      );

      socket.emit("new message", data); // Envoyer le message via Socket.io
      setMessages([...messages, data]);
      setNewMessage("");
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user); // Envoyer les données utilisateur pour la configuration du socket
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
  socket.on("message recieved", (newMessageRecieved) => {
    if (
      !selectedChatCompare || // Si aucun chat sélectionné
      selectedChatCompare._id !== newMessageRecieved.chat._id
    ) {
      // Logique pour les notifications (message reçu hors du chat ouvert)
      if (!notification.some((n) => n._id === newMessageRecieved._id)) {
        setNotification([newMessageRecieved, ...notification]);
        toast.info(
          `Nouveau message de ${
            newMessageRecieved.sender.name
          } : ${newMessageRecieved.content.substring(0, 30)}...`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    } else {
      setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
    }
  });

  // Nettoyage de l'événement lors du démontage du composant
  return () => {
    socket.off("message recieved");
  };
}, [notification, selectedChatCompare]);


  // Fonction pour détecter la saisie
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1rem",
        backgroundColor: "#f5f5f5",
        width: "100%",
        height: "100%",
        borderRadius: "8px",
      }}
    >
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginBottom: "10px",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center" }}>Chargement...</div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message._id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                justifyContent:
                  message.sender._id === user._id ? "flex-end" : "flex-start",
              }}
            >
              {message.sender._id !== user._id && (
                <img
                  src={message.sender.pic}
                  alt={message.sender.name}
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
              )}

              <div
                style={{
                  padding: "10px 15px",
                  maxWidth: "60%",
                  backgroundColor:
                    message.sender._id === user._id ? "#DCF8C6" : "#f0f0f0",
                  color: "#000",
                  borderRadius:
                    message.sender._id === user._id
                      ? "15px 15px 0 15px"
                      : "15px 15px 15px 0",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  textAlign: "left",
                }}
              >
                {message.sender._id !== user._id && (
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#555",
                      marginBottom: "5px",
                    }}
                  >
                    {message.sender.name}
                  </div>
                )}
                <div>{message.content}</div>
              </div>

              {message.sender._id === user._id && (
                <img
                  src={message.sender.pic}
                  alt="Moi"
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    marginLeft: "10px",
                  }}
                />
              )}
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center" }}>Aucun message trouvé.</div>
        )}

        {isTyping && (
          <div style={{ marginTop: "5px" }}>
            Quelqu'un est en train d'écrire...
          </div>
        )}
      </div>

      {/* Barre d'entrée */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Write a message..."
          value={newMessage}
          onChange={typingHandler}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            backgroundColor: "#38B2AC",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Envoyer
        </button>
      </div>
      {/* Container des notifications */}
      <ToastContainer />
    </div>
  );
};

export default SingleChat;
