const asyncHandler = require("../../loaders/asyncHandler");
const Board = require("../../models/BoardModel");
const BoardMember = require("../../models/BoardMember");

const getBoard = asyncHandler(async (req, res) => {
    // tìm tất cả board mà user là thành viên
    const boardMembers = await BoardMember.find({
        userId: req.user._id,
    }).select("boardId role lastViewedAt");
    // lấy danh sách boardId
    const boardIds = boardMembers.map((bm) => bm.boardId);

    // lấy chi tiết board theo id
    const boards = await Board.find({
        _id: { $in: boardIds },
        isArchived: false,
    })
        .populate("ownerId", "name email")
        .sort({ createdAt: -1 });

    // thêm role (ở BoardMember) vào từng board
    const boardsWithRole = boards.map((board) => {
        const memberInfo = boardMembers.find(
            (bm) => bm.boardId.toString() === board._id.toString()
        );

        return {
            id: board._id,
            name: board.name,
            description: board.description,
            background: board.background,
            owner: board.ownerId,
            role: memberInfo ? memberInfo.role : "member",
            lastViewedAt: memberInfo ? memberInfo.lastViewedAt : null,
            createdAt: board.createdAt,
            updatedAt: board.updatedAt,
        };
    });
    res.status(200).json({
        success: true,
        message: "Lấy danh sách bảng thành công",
        count: boardsWithRole.length,
        data: boardsWithRole,
    });
});

// lấy chi tiết board theo id

module.exports = getBoard;
