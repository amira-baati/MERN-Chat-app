import React, { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      {user && <SideDrawer />}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch", // Étend les colonnes verticalement
          width: "100%",
          height: "calc(100% - 50px)", // Tient compte de la barre supérieure
          padding: "10px",
          gap: "15px", // Ajoute de l'espace entre les colonnes
        }}
      >
        {/* Section "Mes Discussions" */}
        {user && (
          <div
            style={{
              width: "30%", // Largeur plus confortable
              height: "100%",
              background: "#f5f5f5",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Design moderne
              overflowY: "auto",
              padding: "15px", // Espacement interne pour éviter les bords compressés
            }}
          >
            <MyChats fetchAgain={fetchAgain} />
          </div>
        )}

        {/* Section "Chat Principal" */}
        {user && (
          <div
            style={{
              flex: 1, // Prend le reste de l'espace
              height: "100%",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Design moderne
              overflowY: "auto",
              padding: "15px", // Espacement interne
            }}
          >
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatpage;
