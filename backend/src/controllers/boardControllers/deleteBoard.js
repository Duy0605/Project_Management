const asyncHandler = require("../../loaders/asyncHandler");
const Board = require("../../models/BoardModel");
const BoardMember = require("../../models/BoardMember");
const Column = require("../../models/ColumnModel");

const deleteBoard = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    // Xóa tất cả các cột của board
    await Column.deleteMany({ boardId });

    // Xóa tất cả các thành viên của board
    await BoardMember.deleteMany({ boardId });

    // Xóa board
    await Board.findByIdAndDelete(boardId);

    res.status(200).json({
        success: true,
        message: "Xóa bảng thành công",
        data: {
            deletedBoardId: boardId,
        }
    });
});

module.exports = deleteBoard;
