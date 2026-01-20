const asyncHandler = require("../../loaders/asyncHandler");
const { verifyToken, generateAccessToken } = require("../../config/jwt");
const User = require("../../models/UserModel");

const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    // Kiểm tra có gửi refresh token không
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Vui lòng cung cấp refresh token",
        });
    }

    // Verify refresh token với JWT_REFRESH_SECRET
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: "Refresh token không hợp lệ hoặc đã hết hạn",
        });
    }

    // Tìm user trong database
    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Người dùng không tồn tại",
        });
    }

    // Tạo access token mới
    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
        success: true,
        message: "Lấy access token mới thành công",
        data: {
            accessToken: newAccessToken,
        },
    });
});

module.exports = refreshToken;
