const asyncHandler = require("../../loaders/asyncHandler");
const Column = require("../../models/ColumnModel");
const Task = require("../../models/TaskModel");
const { generateBoardStructure } = require("../../config/ai");

const generateStructure = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { boardId } = req.params;
    const { description, previewOnly = true } = req.body;

    if (!description || description.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Description không được để trống",
        });
    }

    const aiResult = await generateBoardStructure(description);

    if (!aiResult.success || !aiResult.data || !Array.isArray(aiResult.data.columns)) {
        return res.status(500).json({
            success: false,
            message: aiResult.error?.message || "AI không khả dụng",
        });
    }

    const plan = aiResult.data;

    if (!plan || !Array.isArray(plan.columns)) {
        return res.status(500).json({
            success: false,
            message: "AI trả về dữ liệu không hợp lệ",
        });
    }

    if (previewOnly) {
        return res.status(200).json({
            success: true,
            preview: true,
            plan,
        });
    }

    const createdColumns = [];

    for (let colIndex = 0; colIndex < plan.columns.length; colIndex++) {
        const col = plan.columns[colIndex];

        const newColumn = await Column.create({
            title: col.title,
            boardId,
            order: colIndex,
        });

        // Tạo tasks
        if (Array.isArray(col.tasks)) {
            for (let taskIndex = 0; taskIndex < col.tasks.length; taskIndex++) {
                const task = col.tasks[taskIndex];

                await Task.create({
                    title: task.title,
                    description: task.description || "",
                    boardId,
                    columnId: newColumn._id,
                    order: taskIndex,
                });
            }
        }

        createdColumns.push(newColumn);
    }

    return res.status(201).json({
        success: true,
        preview: false,
        message: "Tạo board structure thành công",
        columns: createdColumns,
    });
});

module.exports = generateStructure;
