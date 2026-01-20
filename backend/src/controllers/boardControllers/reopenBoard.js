const Board = require("../../models/BoardModel");
const asyncHandler = require("../../loaders/asyncHandler");
const createActivity = require("../activityControllers/createActivity");

const reopenBoard = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    // Kiểm tra board có tồn tại không
    const board = await Board.findById(boardId);
    if (!board) {
        return res.status(404).json({
            success: false,
            message: "Không tìm thấy bảng",
        });
    }

    // Kiểm tra board có đang đóng không
    if (!board.isArchived) {
        return res.status(400).json({
            success: false,
            message: "Bảng này chưa bị đóng",
        });
    }

    // Mở lại bảng
    board.isArchived = false;
    await board.save();

    // Log activity
    await createActivity(req.user._id, "reopened_board", {
        board: board._id,
    });

    res.status(200).json({
        success: true,
        message: "Mở lại bảng thành công",
        data: board,
    });
});

module.exports = reopenBoard;
