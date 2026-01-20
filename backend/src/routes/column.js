const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/auth");
const { isMember } = require("../middlewares/boardAuth");

const createColumn = require("../controllers/columnControllers/createColumn");
const getColumn = require("../controllers/columnControllers/getColumn");
const updateColumn = require("../controllers/columnControllers/updateTitleColumn");
const deleteColumn = require("../controllers/columnControllers/deleteColumn");
const reorderColumns = require("../controllers/columnControllers/reorderColumns");

router.post("/:boardId", authenticate, isMember, createColumn);
router.get("/:boardId", authenticate, isMember, getColumn);
router.put("/:boardId/reorder", authenticate, isMember, reorderColumns);
router.put("/:boardId/:columnId", authenticate, isMember, updateColumn);
router.delete("/:boardId/:columnId", authenticate, isMember, deleteColumn);

module.exports = router;
