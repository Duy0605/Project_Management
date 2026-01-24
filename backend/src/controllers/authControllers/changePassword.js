const bcrypt = require("bcryptjs");
const User = require("../../models/UserModel");
const asyncHandler = require("../../loaders/asyncHandler");

const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Vui lòng nhập đầy đủ thông tin",
        });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Mật khẩu mới phải có ít nhất 6 ký tự",
        });
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Người dùng không tồn tại",
        });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Mật khẩu hiện tại không đúng",
        });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        return res.status(400).json({
            success: false,
            message: "Mật khẩu mới không được trùng với mật khẩu cũ",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Đổi mật khẩu thành công",
    });
});

module.exports = changePassword;
