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

    // tìm user theo email
    const user = await User.findOne({
        email: email.toLowerCase().trim(),
    }).select("_id name email avatar avatarColor");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Không tìm thấy user với email này",
        });
    }

    // kiểm tra user đã là thành viên chưa
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

    // thêm thành viên
    const newMember = await BoardMember.create({
        boardId,
        userId: user._id,
        role: "member",
    });

    await newMember.populate("userId", "name email avatar avatarColor");

    // log activity
    await createActivity(req.user._id, "added_member", {
        board: boardId,
        targetUser: user._id,
        metadata: {
            memberName: user.name,
            memberEmail: user.email,
            boardName: req.board?.name,
        },
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
