import axiosInstance from "../utils/axiosConfig";

const columnService = {
    getColumns: async (boardId) => {
        try {
            const response = await axiosInstance.get(`/columns/${boardId}`);
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lấy danh sách column thất bại",
            };
        }
    },

    createColumn: async (boardId, columnData) => {
        try {
            const response = await axiosInstance.post(
                `/columns/${boardId}`,
                columnData
            );
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || "Tạo column thành công",
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Tạo column thất bại",
            };
        }
    },

    updateColumn: async (boardId, columnId, columnData) => {
        try {
            const response = await axiosInstance.put(
                `/columns/${boardId}/${columnId}`,
                columnData
            );
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || "Cập nhật column thành công",
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Cập nhật column thất bại",
            };
        }
    },
    deleteColumn: async (boardId, columnId) => {
        try {
            const response = await axiosInstance.delete(
                `/columns/${boardId}/${columnId}`
            );
            return {
                success: true,
                message: response.data.message || "Xóa column thành công",
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Xóa column thất bại",
            };
        }
    },

    reorderColumns: async (boardId, columnId, newOrder) => {
        try {
            const response = await axiosInstance.put(
                `/columns/${boardId}/reorder`,
                { columnId, newOrder }
            );
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || "Sắp xếp column thành công",
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Sắp xếp column thất bại",
            };
        }
    },
};

export default columnService;
