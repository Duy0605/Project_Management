const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../../models/UserModel");
const asyncHandler = require("../../loaders/asyncHandler");

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    
    if (!newPassword || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Vui lòng nhập mật khẩu mới và xác nhận mật khẩu",
        });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
        });
    }
    // hash token từ url
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // tim user
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
        });
    }
    // kiểm tra trùng mật khẩu cũ
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        return res.status(400).json({
            success: false,
            message: "Mật khẩu mới không được trùng với mật khẩu cũ",
        });
    }

    // hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // xóa token và thời gian hết hạn
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    // Lưu user với mật khẩu mới
    await user.save();

    res.status(200).json({
        success: true,
        message: "Đặt lại mật khẩu thành công",
    });
});

module.exports = resetPassword;
