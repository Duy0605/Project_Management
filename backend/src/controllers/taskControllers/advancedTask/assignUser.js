const asyncHandler = require("../../../loaders/asyncHandler");
const Task = require("../../../models/TaskModel");
const User = require("../../../models/UserModel");
const Column = require("../../../models/ColumnModel");
const createActivity = require("../../activityControllers/createActivity");

const assignUser = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { userId } = req.body;

    // kiểm tra task
    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task không tồn tại",
        });
    }

    // kiểm tra user
    const user = await User.findById(userId).select("name email");
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Người dùng không tồn tại",
        });
    }

    // kiểm tra đã được gán chưa
    if (task.assignees.includes(userId)) {
        return res.status(400).json({
            success: false,
            message: "Người dùng đã được gán cho task này",
        });
    }

    // lấy thông tin trước khi thay đổi
    const taskTitle = task.title;
    const boardName = req.board?.name;

    const column = await Column.findById(task.columnId).select("title");
    const columnTitle = column?.title;

    // gán user
    task.assignees.push(userId);
    await task.save();

    // log activity
    await createActivity(req.user._id, "assigned_task", {
        board: task.boardId,
        task: task._id,
        column: task.columnId,
        targetUser: userId,
        metadata: {
            taskTitle,
            columnTitle,
            boardName,
            targetUserName: user.name,
        },
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
