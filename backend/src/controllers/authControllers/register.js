const bcrypt = require("bcryptjs");
const User = require("../../models/UserModel");
const asyncHandler = require("../../loaders/asyncHandler");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../../config/jwt");

const register = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // dữ liệu đầu vào
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Vui lòng nhập đầy đủ thông tin",
        });
    }

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Mật khẩu xác nhận không khớp",
        });
    }

    // kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "Email đã được sử dụng",
        });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Danh sách màu avatar
    const avatarColors = [
        "bg-gradient-to-br from-blue-500 to-blue-700",
        "bg-gradient-to-br from-green-500 to-green-700",
        "bg-gradient-to-br from-red-500 to-red-700",
        "bg-gradient-to-br from-orange-500 to-orange-700",
        "bg-gradient-to-br from-yellow-500 to-yellow-700",
        "bg-gradient-to-br from-purple-500 to-purple-700",
        "bg-gradient-to-br from-amber-600 to-amber-800",
    ];
    const randomColor =
        avatarColors[Math.floor(Math.random() * avatarColors.length)];

    // tạo user mới
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        avatarColor: randomColor,
    });

    // tạo JWT token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // đăng ký thành công
    res.status(201).json({
        success: true,
        message: "Đăng ký thành công",
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

module.exports = register;
