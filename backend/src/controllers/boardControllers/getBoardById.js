const asyncHandler = require("../../loaders/asyncHandler");
const Board = require("../../models/BoardModel");
const BoardMember = require("../../models/BoardMember");

const getBoardById = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    // Kiểm tra user có quyền truy cập board không
    const boardMember = await BoardMember.findOne({
        boardId: boardId,
        userId: req.user._id,
    });

    if (!boardMember) {
        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền truy cập board này",
        });
    }

    // Lấy thông tin board
    const board = await Board.findById(boardId).populate(
        "ownerId",
        "name email",
    );

    if (!board) {
        return res.status(404).json({
            success: false,
            message: "Board không tồn tại",
        });
    }

    if (board.isArchived) {
        return res.status(404).json({
            success: false,
            message: "Board đã bị lưu trữ",
        });
    }

    return res.status(200).json({
        success: true,
        data: {
            id: board._id,
            name: board.name,
            description: board.description,
            background: board.background,
            ownerId: {
                id: board.ownerId._id,
                name: board.ownerId.name,
                email: board.ownerId.email,
            },
            createdAt: board.createdAt,
            updatedAt: board.updatedAt,
            role: boardMember.role,
        },
    });
});

module.exports = getBoardById;
