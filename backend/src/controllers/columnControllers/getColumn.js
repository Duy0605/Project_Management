const asyncHandler = require("../../loaders/asyncHandler");
const Column = require("../../models/ColumnModel");

const getColumn = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    const columns = await Column.find({ boardId }).sort({ order: 1 });

    res.status(200).json({
        success: true,
        message: "Lấy danh sách cột thành công",
        data: columns.map((column) => ({
            id: column._id,
            title: column.title,
            boardId: column.boardId,
            order: column.order,
        })),
    });
});

module.exports = getColumn;
