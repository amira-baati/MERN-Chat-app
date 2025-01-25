const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const multer = require("multer");
const path = require("path");
//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les fichiers seront sauvegardés
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nom unique pour chaque fichier
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accepter le fichier
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });
const updateProfilePic = [
  upload.single("pic"),
  asyncHandler(async (req, res) => {
    console.log("Request received for profile update:", req.user);

    if (!req.file) {
      console.error("No file provided");
      return res.status(400).json({ message: "No picture provided" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updating user profile with new picture...");
    user.pic = `/uploads/${req.file.filename}`;
    await user.save();

    console.log("User profile updated successfully");
    res.status(200).json({
      message: "Profile picture updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
      },
    });
  }),
];




module.exports = { allUsers, registerUser, authUser, updateProfilePic };