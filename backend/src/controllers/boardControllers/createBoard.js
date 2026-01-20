const asyncHandler = require("../../loaders/asyncHandler");
const Board = require("../../models/BoardModel");
const Column = require("../../models/ColumnModel");
const BoardMember = require("../../models/BoardMember");
const createActivity = require("../activityControllers/createActivity");

const createBoard = asyncHandler(async (req, res) => {
    const { name, description, background } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Tiêu đề không được để trống",
        });
    }

    // Tạo board mới
    const board = await Board.create({
        name: name.trim(),
        description: description || "",
        background: background || "default",
        ownerId: req.user._id,
    });

    // Tự động thêm owner vào bảng BoardMember
    await BoardMember.create({
        boardId: board._id,
        userId: req.user._id,
        role: "owner",
    });

    // Log activity
    await createActivity(req.user._id, "created_board", {
        board: board._id,
    });

    res.status(200).json({
        success: true,
        message: "Tạo bảng thành công",
        data: board,
    });
});

module.exports = createBoard;
