const Board = require("../../models/BoardModel");
const asyncHandler = require("../../loaders/asyncHandler");
const createActivity = require("../activityControllers/createActivity");

const closeBoard = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    // tìm board
    const board = await Board.findById(boardId);
    if (!board) {
        return res.status(404).json({
            success: false,
            message: "Không tìm thấy bảng",
        });
    }

    // đã đóng rồi
    if (board.isArchived) {
        return res.status(400).json({
            success: false,
            message: "Bảng này đã được đóng",
        });
    }

    // lưu tên board trước khi đóng
    const boardName = board.name;

    // đóng bảng
    board.isArchived = true;
    await board.save();

    // log activity
    await createActivity(req.user._id, "closed_board", {
        board: board._id,
        metadata: {
            boardName: boardName,
        },
    });

    res.status(200).json({
        success: true,
        message: "Đóng bảng thành công",
        data: {
            id: board._id,
            isArchived: board.isArchived,
        },
    });
});

module.exports = closeBoard;
