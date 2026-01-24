import axiosInstance from "../utils/axiosConfig";

const userService = {
    // Lấy danh sách tất cả users
    getAllUsers: async () => {
        try {
            const response = await axiosInstance.get("/users/all");
            return {
                success: true,
                data: response.data.data,
                count: response.data.count,
            };
        } catch (error) {
            console.error("Get all users error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lỗi khi lấy danh sách người dùng",
            };
        }
    },

    // Lấy danh sách users có chung board với current user
    getSharedUsers: async () => {
        try {
            const response = await axiosInstance.get("/users/shared");
            return {
                success: true,
                data: response.data.data,
                count: response.data.count,
            };
        } catch (error) {
            console.error("Get shared users error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lỗi khi lấy danh sách thành viên chung",
            };
        }
    },

    // Cập nhật thông tin profile
    updateProfile: async (profileData) => {
        try {
            const response = await axiosInstance.put(
                "/users/profile",
                profileData,
            );
            return {
                success: true,
                message: response.data.message,
                data: response.data.data,
            };
        } catch (error) {
            console.error("Update profile error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lỗi khi cập nhật thông tin",
            };
        }
    },
    // Đổi mật khẩu
    changePassword: async ({
        currentPassword,
        newPassword,
        confirmPassword,
    }) => {
        try {
            const response = await axiosInstance.post(
                "/users/change-password",
                {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                },
            );
            return {
                success: true,
                message: response.data.message,
            };
        } catch (error) {
            console.error("Change password error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message || "Lỗi khi đổi mật khẩu",
            };
        }
    },
};

export default userService;
