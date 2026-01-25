const asyncHandler = require("../../loaders/asyncHandler");
const Column = require("../../models/ColumnModel");
const createActivity = require("../activityControllers/createActivity");

const createColumn = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Tên cột không được để trống",
        });
    }

    const lastColumn = await Column.findOne({ boardId })
        .sort({ order: -1 })
        .select("order");
    const order = lastColumn ? lastColumn.order + 1 : 0;

    // Tạo cột mới
    const newColumn = await Column.create({
        title: title.trim(),
        boardId,
        order,
    });

    // Real-time update và Socket.io
    global.io.to(boardId.toString()).emit("column_created", {
        _id: newColumn._id,
        title: newColumn.title,
        boardId: newColumn.boardId,
        order: newColumn.order,
    });

    // Log activity
    await createActivity(req.user._id, "created_column", {
        board: boardId,
        metadata: { columnTitle: newColumn.title },
    });

    res.status(201).json({
        success: true,
        message: "Tạo cột thành công",
        data: {
            id: newColumn._id,
            title: newColumn.title,
            boardId: newColumn.boardId,
            order: newColumn.order,
        },
    });
});

module.exports = createColumn;
