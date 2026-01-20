const asyncHandler = require("../../loaders/asyncHandler");
const Board = require("../../models/BoardModel");
const BoardMember = require("../../models/BoardMember");

const getRecentBoards = asyncHandler(async (req, res) => {
    const boardMembers = await BoardMember.find({
        userId: req.user._id,
        lastViewedAt: { $ne: null },
    })
        .select("boardId role lastViewedAt")
        .sort({ lastViewedAt: -1 })
        .limit(4);

    const boardIds = boardMembers.map((bm) => bm.boardId);

    const boards = await Board.find({
        _id: { $in: boardIds },
        isArchived: false,
    }).populate("ownerId", "name email");

    const boardsWithInfo = boardMembers
        .map((memberInfo) => {
            const board = boards.find(
                (b) => b._id.toString() === memberInfo.boardId.toString()
            );

            if (!board) return null;

            return {
                id: board._id,
                name: board.name,
                description: board.description,
                background: board.background,
                owner: board.ownerId,
                role: memberInfo.role,
                lastViewedAt: memberInfo.lastViewedAt,
                createdAt: board.createdAt,
                updatedAt: board.updatedAt,
            };
        })
        .filter(Boolean);

    res.status(200).json({
        success: true,
        message: "Lấy danh sách bảng gần đây thành công",
        count: boardsWithInfo.length,
        data: boardsWithInfo,
    });
});

module.exports = getRecentBoards;
