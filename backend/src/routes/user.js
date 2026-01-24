const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const getUser = require("../controllers/userControllers/getUser");
const getAllUsers = require("../controllers/userControllers/getAllUsers");
const getSharedUsers = require("../controllers/userControllers/getSharedUsers");
const updateProfile = require("../controllers/userControllers/updateProfile");
const changePassword = require("../controllers/authControllers/changePassword");

router.get("/me", authenticate, getUser);
router.get("/all", authenticate, getAllUsers);
router.get("/shared", authenticate, getSharedUsers);
router.put("/profile", authenticate, updateProfile);
router.post("/change-password", authenticate, changePassword);

module.exports = router;
