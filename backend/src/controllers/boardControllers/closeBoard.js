const Board = require("../../models/BoardModel");
const asyncHandler = require("../../loaders/asyncHandler");
const createActivity = require("../activityControllers/createActivity");

const closeBoard = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    // Kiểm tra board có tồn tại không
    const board = await Board.findById(boardId);
    if (!board) {
        return res.status(404).json({
            success: false,
            message: "Không tìm thấy bảng",
        });
    }

    // Kiểm tra board đã đóng chưa
    if (board.isArchived) {
        return res.status(400).json({
            success: false,
            message: "Bảng này đã được đóng",
        });
    }

    // Đóng bảng
    board.isArchived = true;
    await board.save();

    // Log activity
    await createActivity(req.user._id, "closed_board", {
        board: board._id,
    });

    res.status(200).json({
        success: true,
        message: "Đóng bảng thành công",
        data: board,
    });
});

module.exports = closeBoard;
