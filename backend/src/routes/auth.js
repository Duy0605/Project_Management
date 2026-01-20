const express = require("express");
const router = express.Router();

const register = require("../controllers/authControllers/register");
const login = require("../controllers/authControllers/login");
const logout = require("../controllers/authControllers/logout");
const refreshToken = require("../controllers/authControllers/refreshToken");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

module.exports = router;
