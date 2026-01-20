const asyncHandler = require("../../loaders/asyncHandler");
const User = require("../../models/UserModel");
const BoardMember = require("../../models/BoardMember");
const createActivity = require("../activityControllers/createActivity");

// Thêm thành viên vào board
const addMember = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const { email } = req.body;

    if (!email || email.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Email không được để trống",
        });
    }

    // Tìm user theo email
    const user = await User.findOne({
        email: email.toLowerCase().trim(),
    }).select("_id name email avatar");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Không tìm thấy user với email này",
        });
    }

    // Kiểm tra user đã là thành viên của board chưa
    const existingMember = await BoardMember.findOne({
        boardId,
        userId: user._id,
    });

    if (existingMember) {
        return res.status(400).json({
            success: false,
            message: "Người dùng đã là thành viên của bảng",
        });
    }

    // Thêm user vào board với vai trò 'member'
    const newMember = await BoardMember.create({
        boardId,
        userId: user._id,
        role: "member",
    });

    await newMember.populate("userId", "name email avatar avatarColor");

    // Log activity
    await createActivity(req.user._id, "added_member", {
        board: boardId,
        targetUser: user._id,
    });

    res.status(201).json({
        success: true,
        message: "Thêm thành viên vào bảng thành công",
        data: {
            id: newMember._id,
            user: newMember.userId,
            role: newMember.role,
            joinedAt: newMember.createdAt,
        },
    });
});

module.exports = addMember;
