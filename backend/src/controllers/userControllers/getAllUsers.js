const asyncHandler = require("../../loaders/asyncHandler");
const User = require("../../models/UserModel");

// Lấy danh sách tất cả users (members)
const getAllUsers = asyncHandler(async (req, res) => {
    // Lấy tất cả users, không include password
    const users = await User.find({})
        .select("name email avatar avatarColor createdAt")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Lấy danh sách người dùng thành công",
        count: users.length,
        data: users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            avatarColor: user.avatarColor,
            createdAt: user.createdAt,
        })),
    });
});

module.exports = getAllUsers;
