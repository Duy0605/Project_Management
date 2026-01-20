const asyncHandler = require("../../loaders/asyncHandler");
const BoardMember = require("../../models/BoardMember");

// Lấy danh sách users có chung board với current user
const getSharedUsers = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;

    // Tìm tất cả boards mà current user là member
    const userBoards = await BoardMember.find({ userId: currentUserId }).select(
        "boardId"
    );
    const boardIds = userBoards.map((board) => board.boardId);

    if (boardIds.length === 0) {
        return res.status(200).json({
            success: true,
            message: "Không có thành viên chung",
            count: 0,
            data: [],
        });
    }

    // Tìm tất cả members của các boards đó 
    const allMembers = await BoardMember.find({
        boardId: { $in: boardIds },
    })
        .populate("userId", "name email avatar avatarColor createdAt")
        .select("userId");

    // Loại bỏ duplicate users
    const uniqueUsers = [];
    const userIds = new Set();

    allMembers.forEach((member) => {
        if (member.userId && !userIds.has(member.userId._id.toString())) {
            userIds.add(member.userId._id.toString());
            uniqueUsers.push({
                id: member.userId._id,
                name: member.userId.name,
                email: member.userId.email,
                avatar: member.userId.avatar,
                avatarColor: member.userId.avatarColor,
                createdAt: member.userId.createdAt,
            });
        }
    });

    res.status(200).json({
        success: true,
        message: "Lấy danh sách thành viên chung thành công",
        count: uniqueUsers.length,
        data: uniqueUsers,
    });
});

module.exports = getSharedUsers;
