import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Failed to load search results.");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      alert("Error renaming group.");
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      alert("User already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      alert("Only admins can add users.");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      alert("Error adding user.");
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("Only admins can remove users.");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      alert("Error removing user.");
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={toggleModal} className="icon-button">
        Open Modal
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedChat.chatName}</h2>
              <button onClick={toggleModal} className="close-button">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="badge-container">
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </div>
              <input
                type="text"
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <button onClick={handleRename} disabled={renameLoading}>
                {renameLoading ? "Renaming..." : "Update"}
              </button>
              <input
                type="text"
                placeholder="Add User to group"
                onChange={(e) => handleSearch(e.target.value)}
              />
              {loading ? (
                <div>Loading...</div>
              ) : (
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => handleRemove(user)} className="leave-button">
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModal;
