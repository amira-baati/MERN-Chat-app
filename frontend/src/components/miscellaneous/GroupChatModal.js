import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { user, chats, setChats } = ChatState();

  const styles = {
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "2rem",
      width: "400px",
      maxWidth: "90%",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem",
    },
    closeBtn: {
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#666",
    },
    inputField: {
      width: "100%",
      padding: "0.75rem",
      marginBottom: "1rem",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "1rem",
    },
    selectedUsers: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      marginBottom: "1rem",
    },
    submitBtn: {
      backgroundColor: "#4caf50",
      color: "white",
      padding: "0.75rem 1.5rem",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "1rem",
    },
    submitBtnHover: {
      backgroundColor: "#45a049",
    },
    toast: {
      position: "fixed",
      bottom: "1rem",
      right: "1rem",
      padding: "1rem",
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      zIndex: 1000,
    },
    toastSuccess: {
      backgroundColor: "#d4edda",
      color: "#155724",
      borderColor: "#c3e6cb",
    },
    toastWarning: {
      backgroundColor: "#fff3cd",
      color: "#856404",
      borderColor: "#ffeeba",
    },
  };

  // Fonction pour afficher un toast temporairement
  const showToast = (toast) => {
    setToast(toast);
    setTimeout(() => {
      setToast(null); // Supprime le toast après 1000 ms
    }, 1000);
  };

  // Fonction pour gérer l'ajout d'utilisateurs au groupe
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      showToast({
        title: "User already added",
        status: "warning",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  // Fonction pour gérer la recherche des utilisateurs
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      showToast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
      });
    }
  };

  // Fonction pour supprimer un utilisateur de la liste sélectionnée
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  // Fonction pour soumettre et créer le groupe
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      showToast({
        title: "Please fill all the fields",
        status: "warning",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setIsOpen(false);
      showToast({
        title: "New Group Chat Created!",
        status: "success",
      });
    } catch (error) {
      showToast({
        title: "Failed to Create the Chat!",
        description: error.response?.data || "An error occurred.",
        status: "error",
      });
    }
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>

      {isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>Create Group Chat</h2>
              <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
                &times;
              </button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                style={styles.inputField}
              />
              <input
                type="text"
                placeholder="Add Users .."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                style={styles.inputField}
              />
              <div style={styles.selectedUsers}>
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                searchResult?.slice(0, 4).map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
              )}
            </div>
            <div>
              <button onClick={handleSubmit} style={styles.submitBtn}>
                Create Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          style={{
            ...styles.toast,
            ...(toast.status === "success"
              ? styles.toastSuccess
              : styles.toastWarning),
          }}
        >
          <strong>{toast.title}</strong>
          <p>{toast.description}</p>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;
