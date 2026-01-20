const asyncHandler = require("../../loaders/asyncHandler");
const User = require("../../models/UserModel");

const updateProfile = asyncHandler(async (req, res) => {
    const { name, bio } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Không tìm thấy người dùng",
        });
    }

    // Cập nhật thông tin
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công",
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            avatarColor: user.avatarColor,
        },
    });
});

module.exports = updateProfile;
