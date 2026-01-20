const asyncHandler = require("../../loaders/asyncHandler");
const Task = require("../../models/TaskModel");
const createActivity = require("../activityControllers/createActivity");

// cập nhật title, startDate, endDate, mô tả, assignees, priority của task
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

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignees !== undefined) task.assignees = assignees;
    if (startDate !== undefined) task.startDate = startDate;
    if (endDate !== undefined) task.endDate = endDate;
    if (priority !== undefined) task.priority = priority;
    await task.save();

    // Log activity
    await createActivity(req.user._id, "updated_task", {
        board: task.boardId,
        task: task._id,
        column: task.columnId,
    });

    res.status(200).json({
        success: true,
        message: "Cập nhật công việc thành công",
        task,
    });
});

module.exports = updateTask;
