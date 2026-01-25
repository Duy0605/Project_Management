import axiosInstance from "../utils/axiosConfig";

const boardService = {
    getAllBoards: async () => {
        try {
            const response = await axiosInstance.get("/boards");
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lấy danh sách board thất bại",
            };
        }
    },

    createBoard: async (boardData) => {
        try {
            const response = await axiosInstance.post("/boards", boardData);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || "Tạo board thành công",
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Tạo board thất bại",
            };
        }
    },

    getBoardById: async (boardId) => {
        try {
            const response = await axiosInstance.get(`/boards/${boardId}`);
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lấy thông tin board thất bại",
            };
        }
    },

    deleteBoard: async (boardId) => {
        try {
            const response = await axiosInstance.delete(`/boards/${boardId}`);
            return {
                success: true,
                message: response.data.message || "Xóa board thành công",
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Xóa board thất bại",
            };
        }
    },

    getMembers: async (boardId) => {
        try {
            const response = await axiosInstance.get(
                `/boards/${boardId}/members`,
            );
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lấy danh sách thành viên thất bại",
            };
        }
    },

    getRecentBoards: async () => {
        try {
            const response = await axiosInstance.get("/boards/recent");
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lấy bảng gần đây thất bại",
            };
        }
    },

    updateLastViewed: async (boardId) => {
        try {
            await axiosInstance.put(`/boards/${boardId}/view`);
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    },

    updateBoard: async (boardId, updateData) => {
        try {
            const response = await axiosInstance.put(
                `/boards/${boardId}`,
                updateData,
            );
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || "Cập nhật board thành công",
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Cập nhật board thất bại",
            };
        }
    },

    addMember: async (boardId, email) => {
        try {
            const response = await axiosInstance.post(
                `/boards/${boardId}/members`,
                { email },
            );
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || "Thêm thành viên thành công",
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Thêm thành viên thất bại",
            };
        }
    },

    removeMember: async (boardId, memberId) => {
        try {
            const response = await axiosInstance.delete(
                `/boards/${boardId}/members/${memberId}`,
            );
            return {
                success: true,
                data: response.data.data,
                message:
                    response.data.message ||
                    "Xóa thành viên khỏi bảng thành công",
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Xóa thành viên khỏi bảng thất bại",
            };
        }
    },

    // Lấy danh sách boards chung với user khác
    getCommonBoards: async (userId) => {
        try {
            const response = await axiosInstance.get(
                `/boards/common/${userId}`,
            );
            return {
                success: true,
                data: response.data.data,
                count: response.data.count,
            };
        } catch (error) {
            console.error("Get common boards error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lỗi khi lấy danh sách bảng chung",
            };
        }
    },

    // Lấy danh sách boards đã đóng
    getClosedBoards: async () => {
        try {
            const response = await axiosInstance.get("/boards/closed");
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lấy danh sách bảng đã đóng thất bại",
            };
        }
    },

    // Mở lại board đã đóng
    reopenBoard: async (boardId) => {
        try {
            const response = await axiosInstance.put(
                `/boards/${boardId}/reopen`,
            );
            return {
                success: true,
                message: response.data.message || "Mở lại bảng thành công",
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Mở lại bảng thất bại",
            };
        }
    },

    // Đóng bảng
    closeBoard: async (boardId) => {
        try {
            const response = await axiosInstance.put(
                `/boards/${boardId}/close`,
            );
            return {
                success: true,
                message: response.data.message || "Đóng bảng thành công",
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Đóng bảng thất bại",
            };
        }
    },
};

export default boardService;
