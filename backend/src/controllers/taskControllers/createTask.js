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

    // lưu tên cột, bảng
    const columnTitle = req.column?.title;
    const boardName = req.board?.name;

    // Tính order cho task mới
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

    // Real-time update và Socket.io
    global.io.to(boardId.toString()).emit("task_created", {
        _id: newTask._id,
        title: newTask.title,
        columnId: newTask.columnId,
        boardId: newTask.boardId,
        order: newTask.order,
    });

    // Log activity 
    await createActivity(req.user._id, "created_task", {
        board: boardId,
        task: newTask._id,
        column: columnId,
        metadata: {
            taskTitle: newTask.title,
            columnTitle,
            boardName,
        },
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
