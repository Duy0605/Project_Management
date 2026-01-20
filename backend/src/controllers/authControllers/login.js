const bcrypt = require("bcryptjs");
const User = require("../../models/UserModel");
const asyncHandler = require("../../loaders/asyncHandler");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../../config/jwt");

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // dữ liệu đầu vào
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Vui lòng nhập email và mật khẩu",
        });
    }

    // tìm user theo email và lấy cả password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Email hoặc mật khẩu không đúng",
        });
    }

    // so sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Email hoặc mật khẩu không đúng",
        });
    }

    // tạo JWT token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // đăng nhập thành công
    res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: {
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatarColor: user.avatarColor,
                bio: user.bio || "",
            },
        },
    });
});

module.exports = login;
