const asyncHandler = require("../../../loaders/asyncHandler");
const Task = require("../../../models/TaskModel");
const createActivity = require("../../activityControllers/createActivity");

const unassignUser = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { userId } = req.body;

    // Kiểm tra task tồn tại
    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task không tồn tại",
        });
    }

    // Kiểm tra user có trong danh sách assignees không
    if (!task.assignees.includes(userId)) {
        return res.status(400).json({
            success: false,
            message: "Người dùng không có trong task này",
        });
    }

    // Xóa user khỏi assignees
    task.assignees = task.assignees.filter(
        (id) => id.toString() !== userId.toString(),
    );

    await task.save();

    // Log activity
    await createActivity(req.user._id, "unassigned_task", {
        board: task.boardId,
        task: task._id,
        column: task.columnId,
        targetUser: userId,
    });

    res.status(200).json({
        success: true,
        message: "Gỡ người dùng khỏi task thành công",
        data: {
            taskId: task._id,
            assignees: task.assignees,
        },
    });
});

module.exports = unassignUser;
