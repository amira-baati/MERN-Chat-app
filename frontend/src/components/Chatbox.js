import React, { useState, useEffect, useRef } from "react";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../config/ChatLogics";
import { FaCog } from "react-icons/fa";
import axios from "axios";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, user, setSelectedChat } = ChatState();
  const [showOptions, setShowOptions] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [usersToAdd, setUsersToAdd] = useState([]); // Pour stocker les utilisateurs sélectionnés
  const optionsRef = useRef(null);

  // Ferme le menu des options si l'utilisateur clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOptions = () => setShowOptions(!showOptions);

  const leaveGroup = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.put(
        "/api/chat/groupremove",
        { chatId: selectedChat._id, userId: user._id },
        config
      );

      setSelectedChat(null); // Réinitialiser la sélection du chat
      setFetchAgain(!fetchAgain); // Rafraîchir les discussions
      setShowOptions(false); // Fermer le menu des options
    } catch (error) {
      console.error("Erreur lors de la sortie du groupe :", error);
    }
  };

  const deleteChat = async () => {
    if (!selectedChat?._id) {
      console.log("Aucun chat sélectionné ou ID non valide");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.delete(`/api/chat/${selectedChat._id}`, config);
      if (response.status === 200) {
        setSelectedChat(null);
        setFetchAgain(!fetchAgain);
        setShowOptions(false);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la discussion :", error);
    }
  };

  const renameGroup = async () => {
    if (!newGroupName) {
      console.log("Nom du groupe vide");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: newGroupName,
        },
        config
      );

      if (response.status === 200) {
        setSelectedChat(response.data); // Mettre à jour le chat avec le nouveau nom
        setIsEditingName(false); // Fermer l'édition du nom
        setFetchAgain(!fetchAgain); // Rafraîchir les discussions après le renommage
      }
    } catch (error) {
      console.error("Erreur lors du renommage du groupe :", error);
    }
  };

  // Fonction pour ajouter des membres au groupe
  const addMembersToGroup = async () => {
    if (usersToAdd.length === 0) {
      console.log("Aucun utilisateur sélectionné");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.put(
        "/api/chat/addmembers",
        {
          chatId: selectedChat._id,
          users: usersToAdd,
        },
        config
      );

      if (response.status === 200) {
        setSelectedChat(response.data); // Mettre à jour la discussion avec les nouveaux membres
        setIsAddingMember(false); // Fermer l'ajout de membres
        setUsersToAdd([]); // Réinitialiser les utilisateurs à ajouter
        setFetchAgain(!fetchAgain); // Rafraîchir les discussions
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout des membres :", error);
    }
  };

  // Fonction pour sélectionner/désélectionner un utilisateur à ajouter
  const toggleUserSelection = (userId) => {
    setUsersToAdd((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div
      style={{
        display: selectedChat ? "flex" : "none",
        flexDirection: "column",
        padding: "0",
        margin: "0",
        backgroundColor: "white",
        width: "100%",
        height: "100%",
        borderRadius: "0",
        border: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "10px",
          borderBottom: "1px solid #ddd",
          textAlign: "left",
          fontSize: "18px",
          fontWeight: "bold",
          fontFamily: "'Work Sans', sans-serif",
        }}
      >
        <div>
          {selectedChat ? (
            !selectedChat.isGroupChat ? getSender(user, selectedChat.users) : selectedChat.chatName
          ) : (
            "Aucune discussion sélectionnée"
          )}
        </div>

        <FaCog
          onClick={toggleOptions}
          style={{
            cursor: "pointer",
            fontSize: "20px",
            color: "#555",
            marginLeft: "10px",
          }}
        />

        {showOptions && (
          <div
            ref={optionsRef}
            style={{
              position: "absolute",
              top: "50px",
              right: "10px",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              zIndex: 10,
              padding: "10px",
              width: "200px",
              opacity: 1,
              transition: "opacity 0.3s ease",
            }}
          >
            {selectedChat && selectedChat.isGroupChat && (
              <div
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  color: "red",
                  transition: "background-color 0.3s ease",
                }}
                onClick={leaveGroup}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8d7da")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Quitter le groupe
              </div>
            )}

            {selectedChat && selectedChat.isGroupChat && !isEditingName && (
              <div
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onClick={() => setIsEditingName(true)}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Renommer le groupe
              </div>
            )}

            {selectedChat && selectedChat.isGroupChat && (
              <div
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onClick={() => setIsAddingMember(true)}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Ajouter des membres
              </div>
            )}

            {isAddingMember && (
              <div
                style={{
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div>
                  <label htmlFor="users">Sélectionner les membres à ajouter :</label>
                  <select
                    id="users"
                    multiple
                    onChange={(e) =>
                      setUsersToAdd(Array.from(e.target.selectedOptions, (option) => option.value))
                    }
                    style={{ padding: "5px", marginBottom: "10px", height: "100px" }}
                  >
                    {/* Récupérez les utilisateurs disponibles ici */}
                    {selectedChat.users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={addMembersToGroup}
                  style={{
                    padding: "5px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Ajouter
                </button>
                <button
                  onClick={() => setIsAddingMember(false)}
                  style={{
                    padding: "5px",
                    backgroundColor: "#ccc",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "5px",
                  }}
                >
                  Annuler
                </button>
              </div>
            )}

            <div
              style={{
                padding: "8px",
                cursor: "pointer",
                color: "gray",
                transition: "background-color 0.3s ease",
              }}
              onClick={deleteChat}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
            >
              Supprimer la discussion
            </div>
          </div>
        )}
      </div>

      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
