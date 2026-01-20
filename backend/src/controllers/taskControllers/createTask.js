const asyncHandler = require("../../loaders/asyncHandler");
const Task = require("../../models/TaskModel");
const createActivity = require("../activityControllers/createActivity");

const createTask = asyncHandler(async (req, res) => {
    const { columnId } = req.params;
    const { title } = req.body;

    const boardId = req.boardId;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Tiêu đề không được để trống",
        });
    }

    // Tính order cho task mới (thêm vào cuối cột)
    const lastTask = await Task.findOne({ columnId })
        .sort({ order: -1 })
        .select("order");

    const order = lastTask ? lastTask.order + 1 : 0;

    // Tạo task mới
    const newTask = await Task.create({
        title: title.trim(),
        columnId,
        boardId,
        order,
    });

    // Log activity
    await createActivity(req.user._id, "created_task", {
        board: boardId,
        task: newTask._id,
        column: columnId,
    });

    res.status(201).json({
        success: true,
        message: "Tạo task thành công",
        data: {
            id: newTask._id,
            title: newTask.title,
            columnId: newTask.columnId,
            boardId: newTask.boardId,
            order: newTask.order,
        },
    });
});

module.exports = createTask;
