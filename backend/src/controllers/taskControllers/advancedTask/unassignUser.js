const asyncHandler = require("../../../loaders/asyncHandler");
const Task = require("../../../models/TaskModel");
const User = require("../../../models/UserModel");
const Column = require("../../../models/ColumnModel");
const createActivity = require("../../activityControllers/createActivity");

const unassignUser = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { userId } = req.body;

    // tìm task
    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task không tồn tại",
        });
    }

    // kiểm tra user có trong task không
    if (!task.assignees.includes(userId)) {
        return res.status(400).json({
            success: false,
            message: "Người dùng không có trong task này",
        });
    }

    // lấy thông tin trước khi gỡ
    const taskTitle = task.title;
    const boardName = req.board?.name;

    const column = await Column.findById(task.columnId).select("title");
    const columnTitle = column?.title;

    const targetUser = await User.findById(userId).select("name email");

    // gỡ user khỏi assignees
    task.assignees = task.assignees.filter(
        (id) => id.toString() !== userId.toString(),
    );

    await task.save();

    // Real-time update và Socket.io
    global.io.to(task.boardId.toString()).emit("user_unassigned", {
        taskId: task._id,
        userId: userId,
    });

    // log activity
    await createActivity(req.user._id, "unassigned_task", {
        board: task.boardId,
        task: task._id,
        column: task.columnId,
        targetUser: userId,
        metadata: {
            taskTitle,
            columnTitle,
            boardName,
            targetUserName: targetUser?.name,
        },
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
