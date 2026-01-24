const crypto = require("crypto");
const User = require("../../models/UserModel");
const asyncHandler = require("../../loaders/asyncHandler");
const sendMail = require("../../config/sendMail");

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Vui lòng nhập email",
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Không tìm thấy người dùng với email này",
        });
    }
    // Tạo token đặt lại mật khẩu
    const resetToken = crypto.randomBytes(32).toString("hex");

    // hash token và lưu vào database
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // hết hạn sau 10 phút
    const resetTokenExpire = Date.now() + 10 * 60 * 1000;
    // Lưu token và thời gian hết hạn vào user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = resetTokenExpire;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
        <h2>Đặt lại mật khẩu</h2>
        <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
        <p>Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn. Liên kết này sẽ hết hạn sau 10 phút.</p>
        <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br/>Project Management</p>
    `;
    try {
        await sendMail({
            to: user.email,
            subject: "Yêu cầu đặt lại mật khẩu",
            html: message,
        });

        res.status(200).json({
            success: true,
            message: "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn",
        });
    } catch (error) {
        // Nếu gửi mail thất bại, xóa token và thời gian hết hạn
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(500).json({
            success: false,
            message:
                "Gửi email đặt lại mật khẩu thất bại, vui lòng thử lại sau",
        });
    }
});

module.exports = forgotPassword;
