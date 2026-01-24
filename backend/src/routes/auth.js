const express = require("express");
const router = express.Router();

const register = require("../controllers/authControllers/register");
const login = require("../controllers/authControllers/login");
const logout = require("../controllers/authControllers/logout");
const refreshToken = require("../controllers/authControllers/refreshToken");
const forgotPassword = require("../controllers/authControllers/forgotPassword");
const resetPassword = require("../controllers/authControllers/resetPassword");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
