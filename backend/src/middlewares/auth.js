const asyncHandler = require("../loaders/asyncHandler");
const { verifyToken } = require("../config/jwt");
const User = require("../models/UserModel");

const authenticate = asyncHandler(async (req, res, next) => {
    // Lấy token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Vui lòng đăng nhập để truy cập",
        });
    }

    // Tách token từ "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify token với JWT_ACCESS_SECRET
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);

    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ hoặc đã hết hạn",
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

    // Gắn user vào req để dùng ở controller
    req.user = user;
    next();
});

module.exports = authenticate;
