const asyncHandler = require("../../loaders/asyncHandler");
const Board = require("../../models/BoardModel");

const updateBoard = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const { name, description } = req.body;

    const updateData = {};

    if (name !== undefined) {
        if (name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Tiêu đề không được để trống",
            });
        }
        updateData.name = name.trim();
    }
    if (description !== undefined) {
        updateData.description = description.trim();
    }

    const updatedBoard = await Board.findByIdAndUpdate(
        boardId,
        { $set: updateData },
        { new: true }
    ).populate("ownerId", "name email avatar");

    res.status(200).json({
        success: true,
        message: "Cập nhật bảng thành công",
        data: {
            id: updatedBoard._id,
            name: updatedBoard.name,
            description: updatedBoard.description,
            owner: updatedBoard.ownerId,
            createdAt: updatedBoard.createdAt,
            updatedAt: updatedBoard.updatedAt,
        },
    });
});

module.exports = updateBoard;
