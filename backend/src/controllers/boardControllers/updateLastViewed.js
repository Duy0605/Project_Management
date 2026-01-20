const asyncHandler = require("../../loaders/asyncHandler");
const BoardMember = require("../../models/BoardMember");

const updateLastViewed = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const userId = req.user._id;

    const boardMember = await BoardMember.findOneAndUpdate(
        { boardId, userId },
        { lastViewedAt: new Date() },
        { new: true }
    );

    if (!boardMember) {
        return res.status(404).json({
            success: false,
            message: "Bạn không phải thành viên của bảng này",
        });
    }

    res.status(200).json({
        success: true,
        message: "Cập nhật thời gian xem thành công",
    });
});

module.exports = updateLastViewed;
