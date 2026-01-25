const asyncHandler = require("../../loaders/asyncHandler");
const Task = require("../../models/TaskModel");
const createActivity = require("../activityControllers/createActivity");

const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, assignees, startDate, endDate, priority } =
        req.body;

    const task = await Task.findById(taskId);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Không tìm thấy công việc",
        });
    }

    // lưu tên task, cột, bảng trước khi cập nhật
    const taskTitle = task.title;
    const columnTitle = req.column?.title;
    const boardName = req.board?.name;

    // Update task
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignees !== undefined) task.assignees = assignees;
    if (startDate !== undefined) task.startDate = startDate;
    if (endDate !== undefined) task.endDate = endDate;
    if (priority !== undefined) task.priority = priority;

    await task.save();

    // Real-time update và Socket.io
    global.io.to(task.boardId.toString()).emit("task_updated", {
        taskId: task._id,
        columnId: task.columnId,
        boardId: task.boardId,
        updates: {
            title: task.title,
            description: task.description,
            assignees: task.assignees,
            startDate: task.startDate,
            endDate: task.endDate,
            priority: task.priority,
        },
    });

    // Log activity
    await createActivity(req.user._id, "updated_task", {
        board: task.boardId,
        task: task._id,
        column: task.columnId,
        metadata: {
            taskTitle: taskTitle,
            columnTitle: columnTitle,
            boardName: boardName,
        },
    });

    res.status(200).json({
        success: true,
        message: "Cập nhật công việc thành công",
        task,
    });
});

module.exports = updateTask;
