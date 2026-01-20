const asyncHandler = require("../../loaders/asyncHandler");
const Task = require("../../models/TaskModel");
const createActivity = require("../activityControllers/createActivity");

// xóa task
const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    // tìm task cần xóa
    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task không tồn tại",
        });
    }
    // lưu order của task cần xóa
    const deletedOrder = task.order;
    const boardId = task.boardId;
    const deletedTaskId = task._id;
    const columnId = task.columnId;

    // xóa task
    await task.deleteOne();

    // cập nhật lại order của các task còn lại trong cùng cột
    await Task.updateMany(
        { columnId: task.columnId, order: { $gt: deletedOrder } },
        { $inc: { order: -1 } },
    );

    // Log activity
    await createActivity(req.user._id, "deleted_task", {
        board: boardId,
        column: columnId,
        metadata: { taskId: deletedTaskId.toString() },
    });

    res.status(200).json({
        success: true,
        message: "Xóa task thành công",
    });
});

module.exports = deleteTask;
