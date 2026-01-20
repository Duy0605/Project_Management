const asyncHandler = require("../../loaders/asyncHandler");
const Board = require("../../models/BoardModel");
const BoardMember = require("../../models/BoardMember");


const getMembers = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    // kiểm tra user có phải thành viên của board không
    const isMember = await BoardMember.findOne({
        boardId,
        userId: req.user._id,
    });

    if (!isMember) {
        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền truy cập bảng này",
        });
    }

    // lấy danh sách thành viên của board
    const members = await BoardMember.find({ boardId })
        .populate("userId", "name email avatar avatarColor")
        .sort({ role: 1, createdAt: 1 });

    res.status(200).json({
        success: true,
        message: "Lấy danh sách thành viên thành công",
        count: members.length,
        data: members.map((member) => ({
            id: member._id,
            user: member.userId,
            role: member.role,
        })),
    });
});

module.exports = getMembers;
