import api from "../utils/axiosConfig";

const taskService = {
    // Lấy tất cả tasks trong một column
    getTasks: async (columnId) => {
        try {
            const response = await api.get(`/tasks/${columnId}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lỗi khi lấy danh sách task",
            };
        }
    },

    // Tạo task mới
    createTask: async (columnId, data) => {
        try {
            const response = await api.post(`/tasks/${columnId}`, data);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Lỗi khi tạo task",
            };
        }
    },

    // Cập nhật task (title, description, priority, startDate, endDate, assignees)
    updateTask: async (taskId, data) => {
        try {
            const response = await api.put(`/tasks/title/${taskId}`, data);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Lỗi khi cập nhật task",
            };
        }
    },

    // Xóa task
    deleteTask: async (taskId) => {
        try {
            const response = await api.delete(`/tasks/${taskId}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Lỗi khi xóa task",
            };
        }
    },

    // Di chuyển task giữa các cột
    moveTask: async (taskId, newColumnId, newOrder) => {
        try {
            const response = await api.put(`/tasks/${taskId}/move`, {
                newColumnId,
                newOrder,
            });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Lỗi khi di chuyển task",
            };
        }
    },

    // Sắp xếp lại thứ tự task
    reorderTask: async (taskId, newOrder) => {
        try {
            const response = await api.put(`/tasks/${taskId}/reorder`, {
                newOrder,
            });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Lỗi khi sắp xếp task",
            };
        }
    },

    // Lấy chi tiết task
    getTaskById: async (taskId) => {
        try {
            const response = await api.get(`/tasks/detail/${taskId}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lỗi khi lấy chi tiết task",
            };
        }
    },

    // Gán người dùng cho task
    assignUser: async (taskId, userId) => {
        try {
            const response = await api.post(`/tasks/${taskId}/assign`, {
                userId,
            });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Lỗi khi gán người dùng",
            };
        }
    },

    // Gỡ người dùng khỏi task
    unassignUser: async (taskId, userId) => {
        try {
            const response = await api.post(`/tasks/${taskId}/unassign`, {
                userId,
            });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Lỗi khi gỡ người dùng",
            };
        }
    },
};

export default taskService;
