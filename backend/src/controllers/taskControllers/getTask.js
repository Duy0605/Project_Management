const asyncHandler = require("../../loaders/asyncHandler");
const Task = require("../../models/TaskModel");

//Lấy danh sách task trong board
const getTask = asyncHandler(async (req, res) => {
    const { columnId } = req.params;

    const tasks = await Task.find({ columnId })
        .populate("assignees", "name email avatar avatarColor")
        .sort({ order: 1 });

    res.status(200).json({
        success: true,
        data: tasks.map((task) => ({
            id: task._id,
            title: task.title,
            columnId: task.columnId,
            boardId: task.boardId,
            order: task.order,
            assignees: task.assignees,
            startDate: task.startDate,
            endDate: task.endDate,
            priority: task.priority,
            isCompleted: task.isCompleted,
        })),
    });
});

// lấy chi tiết task theo id
const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate(
        "assignees",
        "name email avatar avatarColor",
    );

    // kiểm tra task có tồn tại không
    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task không tồn tại",
        });
    }

    res.status(200).json({
        success: true,
        data: {
            id: task._id,
            title: task.title,
            columnId: task.columnId,
            boardId: task.boardId,
            description: task.description,
            assignees: task.assignees,
            startDate: task.startDate,
            endDate: task.endDate,
            priority: task.priority,
            isCompleted: task.isCompleted,
        },
    });
});

module.exports = { getTask, getTaskById };
