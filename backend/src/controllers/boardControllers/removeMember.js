const asyncHandler = require("../../loaders/asyncHandler");
const BoardMember = require("../../models/BoardMember");
const createActivity = require("../activityControllers/createActivity");

const removeMember = asyncHandler(async (req, res) => {
    const { boardId, memberId } = req.params;

    // kiểm tra thành viên có tồn tại trong board không
    const member = await BoardMember.findOne({
        boardId,
        userId: memberId,
    });
    if (!member) {
        return res.status(404).json({
            success: false,
            message: "Thành viên không tồn tại trong bảng",
        });
    }
    // không cho phép xóa chính mình
    if (member.userId.toString() === req.user._id.toString()) {
        return res.status(400).json({
            success: false,
            message: "Bạn không thể xóa chính mình khỏi bảng",
        });
    }
    // xóa thành viên khỏi board
    await BoardMember.deleteOne({ _id: member._id });

    // Log activity
    await createActivity(req.user._id, "removed_member", {
        board: boardId,
        targetUser: memberId,
    });

    res.status(200).json({
        success: true,
        message: "Xóa thành viên khỏi bảng thành công",
        data: {
            removeMember: {
                id: member._id,
                userId: member.userId,
                role: member.role,
            },
        },
    });
});

module.exports = removeMember;
