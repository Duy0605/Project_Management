const Board = require("../../models/BoardModel");
const BoardMember = require("../../models/BoardMember");
const asyncHandler = require("../../loaders/asyncHandler");

const getClosedBoards = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Lấy các boardId mà user là member
    const memberships = await BoardMember.find({ userId }).select("boardId");
    const boardIds = memberships.map((m) => m.boardId);

    // Lấy các board đã đóng
    const closedBoards = await Board.find({
        _id: { $in: boardIds },
        isArchived: true,
    })
        .populate("ownerId", "name email")
        .sort({ updatedAt: -1 });

    res.status(200).json({
        success: true,
        data: closedBoards,
    });
});

module.exports = getClosedBoards;
