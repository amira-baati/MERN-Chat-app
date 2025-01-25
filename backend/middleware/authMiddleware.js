const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Vérifiez si un jeton est présent dans l'en-tête d'autorisation
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Récupérer le jeton en le divisant
      token = req.headers.authorization.split(" ")[1];

      // Décoder le jeton JWT pour obtenir l'ID utilisateur
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Rechercher l'utilisateur dans la base de données, sans inclure son mot de passe
      req.user = await User.findById(decoded.id).select("-password");

      // Vérifiez si l'utilisateur existe
      if (!req.user) {
        res.status(404);
        throw new Error("User not found");
      }

      // Log pour déboguer (peut être supprimé en production)
      console.log("Authenticated user:", req.user._id, req.user.email);

      next(); // Passe au prochain middleware ou contrôleur
    } catch (error) {
      console.error("Token verification failed:", error.message);

      // Gérer les erreurs de jeton (ex. expiration)
      if (error.name === "TokenExpiredError") {
        res.status(401);
        throw new Error("Token expired, please log in again");
      }

      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // Si aucun jeton n'est fournit
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
