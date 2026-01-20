const asyncHandler = require("../../../loaders/asyncHandler");
const Task = require("../../../models/TaskModel");
const User = require("../../../models/UserModel");
const createActivity = require("../../activityControllers/createActivity");

const assignUser = asyncHandler(async (req, res) => {
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
    // Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Người dùng không tồn tại",
        });
    }
    // Kiểm tra user đã được gán cho task chưa
    if (task.assignees.includes(userId)) {
        return res.status(400).json({
            success: false,
            message: "Người dùng đã được gán cho task này",
        });
    }

    task.assignees.push(userId);

    await task.save();

    // Log activity
    await createActivity(req.user._id, "assigned_task", {
        board: task.boardId,
        task: task._id,
        column: task.columnId,
        targetUser: userId,
    });

    res.status(200).json({
        success: true,
        message: "Gán người dùng cho task thành công",
        data: {
            taskId: task._id,
            assignees: task.assignees,
        },
    });
});

module.exports = assignUser;
