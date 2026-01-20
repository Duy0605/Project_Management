const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/auth");
const { isMember } = require("../middlewares/boardAuth");

const createTask = require("../controllers/taskControllers/createTask");
const {
    getTask,
    getTaskById,
} = require("../controllers/taskControllers/getTask");
const updateTask = require("../controllers/taskControllers/updateTask");
const deleteTask = require("../controllers/taskControllers/deleteTask");
const moveTask = require("../controllers/taskControllers/moveTask");
const reorderTask = require("../controllers/taskControllers/reorderTask");
const assignUser = require("../controllers/taskControllers/advancedTask/assignUser");
const unassignUser = require("../controllers/taskControllers/advancedTask/unassignUser");

router.post("/:columnId", authenticate, isMember, createTask);
router.get("/:columnId", authenticate, isMember, getTask);
router.get("/detail/:taskId", authenticate, isMember, getTaskById);
router.put("/title/:taskId", authenticate, isMember, updateTask);
router.delete("/:taskId", authenticate, isMember, deleteTask);
router.put("/:taskId/move", authenticate, isMember, moveTask);
router.put("/:taskId/reorder", authenticate, isMember, reorderTask);
router.post("/:taskId/assign", authenticate, isMember, assignUser);
router.post("/:taskId/unassign", authenticate, isMember, unassignUser);

module.exports = router;
