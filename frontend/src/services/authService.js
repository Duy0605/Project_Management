import axiosInstance from "../utils/axiosConfig.jsx";

export const forgotPassword = {
    // Gọi API quên mật khẩu
    requestPasswordReset: async (email) => {
        try {
            const response = await axiosInstance.post("/auth/forgot-password", {
                email,
            });
            return {
                success: true,
                message: response.data.message,
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lỗi khi gửi yêu cầu đặt lại mật khẩu",
            };
        }
    },

    // Gọi API đặt lại mật khẩu
    resetPassword: async (token, newPassword, confirmPassword) => {
        try {
            const response = await axiosInstance.post(
                `/auth/reset-password/${token}`,
                { newPassword, confirmPassword },
            );
            return {
                success: true,
                message: response.data.message,
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Lỗi khi đặt lại mật khẩu",
            };
        }
    },
};

export default forgotPassword;
