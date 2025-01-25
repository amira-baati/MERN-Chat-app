const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateProfilePic
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route pour obtenir tous les utilisateurs (protégée)
router.route("/").get(protect, allUsers);

// Route pour l'inscription (non protégée)
router.route("/").post(registerUser);

// Route pour la connexion (non protégée)
router.post("/login", authUser);

router.put("/profile-pic", protect, updateProfilePic); 
module.exports = router;
