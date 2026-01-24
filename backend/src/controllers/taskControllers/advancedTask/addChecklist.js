const asyncHandler = require("../../../loaders/asyncHandler");
const Task = require("../../../models/TaskModel");

const addChecklist = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { isCompleted } = req.body;

    // kiểm tra task
    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task không tồn tại",
        });
    }

    // xác định trạng thái mới
    const newCompletedState =
        typeof isCompleted === "boolean"
            ? isCompleted
            : !task.isCompleted;

    // cập nhật checklist
    task.isCompleted = newCompletedState;
    await task.save();

    // trả response
    res.status(200).json({
        success: true,
        message: newCompletedState
            ? "Đánh dấu checklist hoàn thành"
            : "Đánh dấu checklist chưa hoàn thành",
        data: {
            taskId: task._id,
            isCompleted: task.isCompleted,
        },
    });
});

module.exports = addChecklist;
