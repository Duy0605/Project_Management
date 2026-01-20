const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const getActivities = require("../controllers/activityControllers/getActivities");

router.get("/", authenticate, getActivities);

module.exports = router;
