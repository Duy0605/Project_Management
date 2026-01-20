const asyncHandler = require("../../loaders/asyncHandler");
// const User = require("../../models/UserModel");

//Lấy thông tin user hiện tại
const getUser = asyncHandler(async (req, res) => {
    // req.user đã được gắn bởi middleware authenticate
    res.status(200).json({
        success: true,
        message: "Lấy thông tin thành công",
        data: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            avatarColor: req.user.avatarColor,
            bio: req.user.bio || "",
        },
    });
});
module.exports = getUser;
