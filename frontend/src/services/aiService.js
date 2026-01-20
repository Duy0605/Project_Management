import axiosInstance from "../utils/axiosConfig.jsx";

export const aiService = {
    // Gọi API để tạo cấu trúc board từ mô tả
    generateBoardStructure: async (
        boardId,
        description,
        previewOnly = true,
    ) => {
        try {
            const response = await axiosInstance.post(
                `/boards/${boardId}/generate-structure`,
                { description, previewOnly },
            );

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message,
            };
        }
    },
};
export default aiService;
