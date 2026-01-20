const asyncHandler = require("../../loaders/asyncHandler");
const Task = require("../../models/TaskModel");
const Column = require("../../models/ColumnModel");

// di chuyển task giữa các cột
const moveTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { newColumnId, newOrder } = req.body;

    // tìm task cần di chuyển
    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task không tồn tại",
        });
    }

    // tìm cột đích
    const newColumn = await Column.findById(newColumnId);
    if (!newColumn) {
        return res.status(404).json({
            success: false,
            message: "Cột đích không tồn tại",
        });
    }

    // lưu thông tin cũ của task
    const oldColumnId = task.columnId;
    const oldOrder = task.order;

    // Cập nhật order của các task trong cột cũ
    await Task.updateMany(
        { columnId: oldColumnId, order: { $gt: oldOrder } },
        { $inc: { order: -1 } }
    );

    // Cập nhật order của các task trong cột mới
    await Task.updateMany(
        { columnId: newColumnId, order: { $gte: newOrder } },
        { $inc: { order: 1 } }
    );
    // cập nhật thông tin task
    task.columnId = newColumnId;
    task.order = newOrder;
    await task.save();
    
    //sắp xếp lại order trong cột cũ và cột mới để đảm bảo tính liên tục
    const tasksInNewColumn = await Task.find({ columnId: newColumnId }).sort({
        order: 1,
    });
    // cập nhật lại order
    for (let i = 0; i < tasksInNewColumn.length; i++) {
        if (tasksInNewColumn[i].order !== i) {
            tasksInNewColumn[i].order = i;
            await tasksInNewColumn[i].save();
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

module.exports = moveTask;
