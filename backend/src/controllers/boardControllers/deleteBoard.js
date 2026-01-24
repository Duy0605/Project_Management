const asyncHandler = require("../../loaders/asyncHandler");
const Board = require("../../models/BoardModel");
const BoardMember = require("../../models/BoardMember");
const Column = require("../../models/ColumnModel");
const createActivity = require("../activityControllers/createActivity");

const deleteBoard = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    // tìm board cần xóa
    const board = await Board.findById(boardId);

    if (!board) {
        return res.status(404).json({
            success: false,
            message: "Bảng không tồn tại",
        });
    }

    const boardName = board.name;

    // xóa tất cả cột của board
    await Column.deleteMany({ boardId });

    // xóa tất cả thành viên của board
    await BoardMember.deleteMany({ boardId });

    // xóa board
    await Board.deleteOne({ _id: boardId });

    // log activity
    await createActivity(req.user._id, "deleted_board", {
        board: boardId,
        metadata: {
            boardName,
        },
    });

    res.status(200).json({
        success: true,
        message: "Xóa bảng thành công",
        data: {
            deletedBoardId: boardId,
        },
    });
});

module.exports = deleteBoard;
