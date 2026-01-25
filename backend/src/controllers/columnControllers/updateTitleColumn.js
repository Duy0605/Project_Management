const asyncHandler = require("../../loaders/asyncHandler");
const Column = require("../../models/ColumnModel");
const createActivity = require("../activityControllers/createActivity");

const updateColumn = asyncHandler(async (req, res) => {
    const { boardId, columnId } = req.params;
    const { title } = req.body;

    // tìm cột cần cập nhật
    const column = await Column.findById(columnId);

    if (!column || column.boardId.toString() !== boardId) {
        return res.status(404).json({
            success: false,
            message: "Cột không tồn tại trong bảng này",
        });
    }

    // lưu tên cột, bảng trước khi cập nhật
    const oldColumnTitle = column.title;
    const boardName = req.board?.name;

    // cập nhật tên cột
    if (title && title.trim() !== "") {
        column.title = title.trim();
    }

    await column.save();

    // Real-time update và Socket.io
    global.io.to(boardId.toString()).emit("column_updated", {
        id: column._id,
        title: column.title,
        boardId: column.boardId,
        order: column.order,
    });

    // Log activity 
    await createActivity(req.user._id, "updated_column", {
        board: boardId,
        metadata: {
            oldColumnTitle,
            newColumnTitle: column.title,
            boardName,
        },
    });

    res.status(200).json({
        success: true,
        message: "Cập nhật cột thành công",
        data: {
            id: column._id,
            title: column.title,
            boardId: column.boardId,
            order: column.order,
        },
    });
});

module.exports = updateColumn;
