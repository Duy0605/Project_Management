const axios = require("axios");
const { response } = require("../app");

const { AI_API_KEY, AI_MODEL } = process.env;

async function callGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${AI_API_KEY}`;

    const response = await axios.post(url, {
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }],
            },
        ],
    });

    return response.data;
}

function extractTextFromGemini(response) {
    if (!response?.candidates?.length) return "";

    let text = response.candidates[0].content.parts
        .map((part) => part.text || "")
        .join("")
        .trim();

    text = text
        .replace(/^\s*```json\s*/, "")
        .replace(/\s*```\s*$/, "")
        .trim();

    return text;
}

function buildPrompt(description) {
    return `
Bạn là một API backend, KHÔNG phải chatbot.

Nhiệm vụ:
- Phân tích mô tả board
- Sinh cấu trúc Kanban

NGÔN NGỮ BẮT BUỘC:
- TOÀN BỘ nội dung phải bằng tiếng Việt
- KHÔNG sử dụng tiếng Anh trong bất kỳ field nào
- KHÔNG phiên âm, KHÔNG từ vay mượn tiếng anh
- Nếu KHÔNG thể trả tiếng việt → trả về JSON rỗng

Mô tả người dùng:
"${description}"

QUY TẮC BẮT BUỘC:
- CHỈ trả về JSON
- KHÔNG markdown
- KHÔNG giải thích
- KHÔNG thêm text ngoài JSON
- Field phải đúng schema

SCHEMA CHÍNH XÁC:
{
  "columns": [
    {
      "title": "string (tiếng việt)",
      "tasks": [
        {
          "title": "string (tiếng việt)",
          "description": "string (tiếng việt)"
        }
      ]
    }
  ]
}

RÀNG BUỘC:
- 5–7 columns
- 5–7 tasks / column
- title ngắn gọn, không emoji
`;
}

async function generateBoardStructure(description) {
    try {
        const prompt = buildPrompt(description);
        const response = await callGemini(prompt);
        const text = extractTextFromGemini(response);

        const boardStructure = JSON.parse(text);
        return {
            success: true,
            data: boardStructure,
        };
    } catch (error) {
        console.error("AI error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });

        return {
            success: false,
            error: {
                message: error.message || "AI không khả dụng",
                status: error.status || 500,
                retryAfter: error.retryAfter || null,
            },
        };
    }
}

module.exports = {
    generateBoardStructure,
};
