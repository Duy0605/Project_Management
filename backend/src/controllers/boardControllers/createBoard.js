const asyncHandler = require("../../loaders/asyncHandler");
const Board = require("../../models/BoardModel");
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

    // tạo board mới
    const board = await Board.create({
        name: name.trim(),
        description: description || "",
        background: background || "default",
        ownerId: req.user._id,
    });

    // thêm owner vào board members
    await BoardMember.create({
        boardId: board._id,
        userId: req.user._id,
        role: "owner",
    });

    // log activity
    await createActivity(req.user._id, "created_board", {
        board: board._id,
        metadata: {
            boardName: board.name,
        },
    });

    res.status(201).json({
        success: true,
        message: "Tạo bảng thành công",
        data: {
            id: board._id,
            name: board.name,
            description: board.description,
            background: board.background,
            ownerId: board.ownerId,
            createdAt: board.createdAt,
        },
    });
});

module.exports = createBoard;
