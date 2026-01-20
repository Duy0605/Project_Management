const asyncHandler = require("../../loaders/asyncHandler");

const logout = asyncHandler(async (req, res) => {
    
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.status(200).json({
        success: true,
        message: "Đăng xuất thành công",
    });
});

module.exports = logout;