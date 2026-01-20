import axiosInstance from "../utils/axiosConfig";

const activityService = {
    // Lấy danh sách hoạt động
    getActivities: async (limit = 20, skip = 0) => {
        try {
            const response = await axiosInstance.get("/activities", {
                params: { limit, skip },
            });
            return {
                success: true,
                data: response.data.data,
                total: response.data.total,
                hasMore: response.data.hasMore,
            };
        } catch (error) {
            console.error("Get activities error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lỗi khi lấy danh sách hoạt động",
            };
        }
    },
};

export default activityService;
