const asyncHandler = require("../../loaders/asyncHandler");
const Task = require("../../models/TaskModel");

// di chuyển task trong cùng một cột
const reorderTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { newOrder } = req.body;

    // tìm task cần di chuyển
    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task không tồn tại",
        });
    }
    // lưu order cũ của task
    const oldOrder = task.order;

    if (newOrder === oldOrder) {
        return res.status(200).json({
            success: true,
            message: "Task đã ở vị trí này",
            data: {
                id: task._id,
                title: task.title,
                columnId: task.columnId,
                boardId: task.boardId,
                order: task.order,
            },
        });
    }
    // cập nhật order của các task trong cùng cột
    if (newOrder < oldOrder) {
        // di chuyển lên trên
        await Task.updateMany(
            {
                columnId: task.columnId,
                order: { $gte: newOrder, $lt: oldOrder },
            },
            { $inc: { order: 1 } }
        );
    } else {
        // di chuyển xuống dưới
        await Task.updateMany(
            {
                columnId: task.columnId,
                order: { $gt: oldOrder, $lte: newOrder },
            },
            { $inc: { order: -1 } }
        );
    }
    // cập nhật thông tin task
    task.order = newOrder;
    await task.save();

    // sắp xếp lại order trong cột để đảm bảo tính liên tục
    const tasksInColumn = await Task.find({ columnId: task.columnId }).sort({
        order: 1,
    });
    // cập nhật lại order
    for (let i = 0; i < tasksInColumn.length; i++) {
        if (tasksInColumn[i].order !== i) {
            tasksInColumn[i].order = i;
            await tasksInColumn[i].save();
        }
    }

    res.status(200).json({
        success: true,
        message: "Di chuyển task thành công",
        data: {
            id: task._id,
            title: task.title,
            columnId: task.columnId,
            boardId: task.boardId,
            order: task.order,
        },
    });
});

module.exports = reorderTask;
