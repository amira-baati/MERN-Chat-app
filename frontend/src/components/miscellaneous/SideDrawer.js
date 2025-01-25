import { useState } from "react";
import { useHistory } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { toast } from "react-toastify";

function SideDrawer() {
  const [isNotificationBoxOpen, setIsNotificationBoxOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setSelectedChat, user, notification, setNotification } = ChatState();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const toggleNotificationBox = () => {
    setIsNotificationBoxOpen((prev) => !prev);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  const openSearchDrawer = () => {
    setIsSearchDrawerOpen(true);
  };

  const closeSearchDrawer = () => {
    setIsSearchDrawerOpen(false);
  };

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please enter a search query");
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
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load search results");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: "1rem", borderBottom: "2px solid #eaeaea" }}>
      {/* Bouton pour ouvrir le sidedrawer */}
      <button style={{ display: "flex", alignItems: "center" }} onClick={openSearchDrawer}>
        <i className="fas fa-search" style={{ marginRight: "8px" }}></i>
        <span>Search User</span>
      </button>

      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>MB CHAT</h1>

      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button style={{ fontSize: "20px", position: "relative" }} onClick={toggleNotificationBox}>
            <i className="fas fa-bell"></i>
            {notification.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-10px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                }}
              >
                {notification.length}
              </span>
            )}
          </button>

          {isNotificationBoxOpen && (
            <div style={{ position: "absolute", right: 0, top: "30px", width: "250px", backgroundColor: "white", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "8px", padding: "10px" }}>
              {notification.length === 0 ? (
                <div style={{ color: "gray", textAlign: "center" }}>Aucune notification</div>
              ) : (
                notification.map((notif) => (
                  <div
                    key={notif._id}
                    style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eaeaea" }}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                      setIsNotificationBoxOpen(false);
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `Nouveau message dans ${notif.chat.chatName}`
                      : `Nouveau message de ${notif.sender.name}`}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Profil */}
        <div style={{ position: "relative", marginLeft: "20px" }}>
          <button style={{ display: "flex", alignItems: "center" }} onClick={toggleProfileMenu}>
            <img
              src={user.pic}
              alt={user.name}
              style={{ width: "32px", height: "32px", borderRadius: "50%", marginRight: "8px" }}
            />
            <span>{user.name}</span>
            <i
              className={`fas fa-chevron-down ${isProfileMenuOpen ? "rotate-180" : "rotate-0"}`}
              style={{ marginLeft: "8px" }}
            ></i>
          </button>

          {isProfileMenuOpen && (
            <div style={{ position: "absolute", right: 0, top: "30px", width: "150px", backgroundColor: "white", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "8px", padding: "10px" }}>
              <div style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eaeaea" }} onClick={() => setIsProfileOpen(true)}>
                My Profile
              </div>
              <div style={{ padding: "10px", cursor: "pointer" }}>
                <button onClick={logoutHandler} style={{ backgroundColor: "red", color: "white", padding: "5px 10px", borderRadius: "4px", border: "none" }}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Profile */}
      {isProfileOpen && <ProfileModal user={user} onClose={() => setIsProfileOpen(false)} />}

      {/* Sidedrawer pour la recherche */}
      {isSearchDrawerOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex" }}>
          <div style={{ backgroundColor: "white", width: "300px", height: "100%", padding: "20px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
            <button style={{ color: "gray", marginBottom: "20px" }} onClick={closeSearchDrawer}>
              <i className="fas fa-times"></i> Close
            </button>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>Search Users</h2>
            <input
              type="text"
              placeholder="Search..."
              style={{ width: "100%", padding: "10px", border: "1px solid #eaeaea", borderRadius: "4px", marginBottom: "20px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              style={{ backgroundColor: "blue", color: "white", padding: "10px", borderRadius: "4px", width: "100%" }}
              onClick={handleSearch}
            >
              Search
            </button>

            {loading ? (
              <div style={{ marginTop: "20px", color: "gray" }}>Loading...</div>
            ) : (
              <div style={{ marginTop: "20px" }}>
                {searchResult.length === 0 ? (
                  <div style={{ color: "gray" }}>No users found</div>
                ) : (
                  searchResult.map((resultUser) => (
                    <div
                      key={resultUser._id}
                      style={{ display: "flex", alignItems: "center", padding: "10px", borderBottom: "1px solid #eaeaea", cursor: "pointer" }}
                      onClick={async () => {
                        try {
                          const config = {
                            headers: {
                              Authorization: `Bearer ${user.token}`,
                            },
                          };
                          const { data } = await axios.post(
                            "/api/chat",
                            { userId: resultUser._id },
                            config
                          );
                          setSelectedChat(data);
                          closeSearchDrawer();
                        } catch (error) {
                          toast.error("Erreur lors de l'ouverture du chat");
                        }
                      }}
                    >
                      <img
                        src={resultUser.pic || "default-profile.png"}
                        alt={resultUser.name}
                        style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                      />
                      <div>
                        <h3 style={{ fontWeight: "bold" }}>{resultUser.name}</h3>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SideDrawer;
