const asyncHandler = require("../../loaders/asyncHandler");
const Task = require("../../models/TaskModel");
const Column = require("../../models/ColumnModel");
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

    // lưu thông tin trước khi xóa
    const deletedOrder = task.order;
    const boardId = task.boardId;
    const columnId = task.columnId;
    const taskTitle = task.title;

    // lấy tên cột, bảng 
    const column = await Column.findById(columnId);
    const columnTitle = column ? column.title : "";
    const boardName = req.board ? req.board.name : "";

    // xóa task
    await task.deleteOne();

    // cập nhật lại order các task còn lại trong cột
    await Task.updateMany(
        { columnId, order: { $gt: deletedOrder } },
        { $inc: { order: -1 } }
    );

    // Real-time update và Socket.io
    global.io.to(boardId.toString()).emit("task_deleted", {
        _id: taskId,
        columnId,
        boardId,
    });

    // Log activity
    await createActivity(req.user._id, "deleted_task", {
        board: boardId,
        column: columnId,
        metadata: {
            taskTitle,
            columnTitle,
            boardName,
        },
    });

    res.status(200).json({
        success: true,
        message: "Xóa task thành công",
    });
});

module.exports = deleteTask;
