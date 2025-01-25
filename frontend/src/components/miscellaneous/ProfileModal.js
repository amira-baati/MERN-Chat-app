import React, { useState } from "react";
import axios from "axios";

const ProfileModal = ({ user, onClose }) => {
  const [newPic, setNewPic] = useState(null);

  // Cette fonction est appelée lorsque l'utilisateur sélectionne un fichier
  const handlePicChange = (e) => {
    const file = e.target.files[0]; // On récupère le premier fichier
    if (file) {
      setNewPic(file); // On le stocke dans l'état
      console.log("File selected:", file); // Log pour vérifier
    }
  };

  // Cette fonction envoie l'image au back-end lorsque l'utilisateur clique sur "Update Picture"
  const handleUpdatePic = async () => {
    if (!newPic) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("pic", newPic);

    console.log("Sending data:", formData); // Log pour vérifier les données envoyées

    try {
      const { data } = await axios.put(
        "/api/user/profile-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Response data:", data); // Log pour vérifier la réponse du serveur
      alert("Profile picture updated successfully");
      onClose();
    } catch (error) {
      console.error("Error:", error); // Capturez l'erreur dans la console
      alert("Error updating profile picture");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-3xl font-bold text-center">{user.name}</h2>
        <div className="flex justify-center mt-4">
          <img
            src={user.pic}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
        <div className="mt-4 text-center">
          <p className="text-lg font-medium">Email: {user.email}</p>
        </div>
    
        <div className="flex justify-center mt-6">
       
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 ml-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
