const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const { isOwner, isMember } = require("../middlewares/boardAuth");

const createBoard = require("../controllers/boardControllers/createBoard");
const getBoard = require("../controllers/boardControllers/getboard");
const getBoardById = require("../controllers/boardControllers/getBoardById");
const getRecentBoards = require("../controllers/boardControllers/getRecentBoards");
const updateLastViewed = require("../controllers/boardControllers/updateLastViewed");
const addMember = require("../controllers/boardControllers/addMember");
const getMembers = require("../controllers/boardControllers/getMembers");
const removeMember = require("../controllers/boardControllers/removeMember");
const updateBoard = require("../controllers/boardControllers/updateBoard");
const deleteBoard = require("../controllers/boardControllers/deleteBoard");
const getCommonBoards = require("../controllers/boardControllers/getCommonBoards");
const getClosedBoards = require("../controllers/boardControllers/getClosedBoards");
const reopenBoard = require("../controllers/boardControllers/reopenBoard");
const closeBoard = require("../controllers/boardControllers/closeBoard");
const generateStructure = require("../controllers/boardControllers/generateStructure");

// AI-generated board structure
router.post("/:boardId/generate-structure", authenticate, isMember, generateStructure);

// board routes
router.post("/", authenticate, createBoard);
router.get("/", authenticate, getBoard);
router.get("/recent", authenticate, getRecentBoards);
router.get("/closed", authenticate, getClosedBoards);
router.get("/common/:userId", authenticate, getCommonBoards);
router.get("/:boardId", authenticate, isMember, getBoardById);
router.put("/:boardId", authenticate, isOwner, updateBoard);
router.put("/:boardId/close", authenticate, isOwner, closeBoard);
router.put("/:boardId/reopen", authenticate, isOwner, reopenBoard);
router.put("/:boardId/view", authenticate, isMember, updateLastViewed);
router.delete("/:boardId", authenticate, isOwner, deleteBoard);

// member routes
router.post("/:boardId/members", authenticate, isOwner, addMember);
router.get("/:boardId/members", authenticate, isMember, getMembers);
router.delete(
    "/:boardId/members/:memberId",
    authenticate,
    isOwner,
    removeMember,
);

module.exports = router;
