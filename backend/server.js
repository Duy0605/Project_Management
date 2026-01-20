const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");

const { generateBoardStructure } = require("./src/config/ai");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // Test AI service
    (async () => {
        const plan = await generateBoardStructure(
            "Phát triển ứng dụng quản lý dự án",
        );
        console.log(JSON.stringify(plan, null, 2));
    })();
});
