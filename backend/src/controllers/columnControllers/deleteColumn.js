const asyncHandler = require("../../loaders/asyncHandler");
const Column = require("../../models/ColumnModel");
const createActivity = require("../activityControllers/createActivity");

const deleteColumn = asyncHandler(async (req, res) => {
    const { boardId, columnId } = req.params;
    // tìm cột cần xóa
    const column = await Column.findById(columnId);

    if (!column || column.boardId.toString() !== boardId) {
        return res.status(404).json({
            success: false,
            message: "Cột không tồn tại trong bảng này",
        });
    }
    // Lưu order của cột cần xóa
    const deletedOrder = column.order;
    const columnTitle = column.title;

    // xóa cột
    await Column.findByIdAndDelete(columnId);

    // Cập nhật lại order của các cột còn lại
    await Column.updateMany(
        { boardId, order: { $gt: deletedOrder } },
        { $inc: { order: -1 } },
    );

    // Real-time update và Socket.io
    global.io.to(boardId.toString()).emit("column_deleted", {
        deleteColumnId: columnId,
        boardId,
    });

    // Log activity
    await createActivity(req.user._id, "deleted_column", {
        board: boardId,
        metadata: { columnTitle: columnTitle },
    });

    res.status(200).json({
        success: true,
        message: "Xóa cột thành công",
        data: {
            deleteColumnId: columnId,
            deletedOrder: deletedOrder,
        },
    });
});

module.exports = deleteColumn;
