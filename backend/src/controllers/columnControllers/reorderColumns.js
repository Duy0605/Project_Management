const asyncHandler = require("../../loaders/asyncHandler");
const Column = require("../../models/ColumnModel");

const reorderColumns = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const { columnId, newOrder } = req.body;

    const column = await Column.findById(columnId);

    if (!column || column.boardId.toString() !== boardId) {
        return res.status(404).json({
            success: false,
            message: "Cột không tồn tại",
        });
    }

    const oldOrder = column.order;

    // nếu vị trí không đôi thì không cần cập nhật
    if (oldOrder === newOrder) {
        return res.status(200).json({
            success: true,
            message: "Thứ tự cột không đổi",
        });
    }

    // Cập nhật thứ tự của cột bị ảnh hưởng
    if (oldOrder < newOrder) {
        await Column.updateMany(
            { boardId, order: { $gt: oldOrder, $lte: newOrder } },
            { $inc: { order: -1 } }
        );
    } else {
        await Column.updateMany(
            { boardId, order: { $gte: newOrder, $lt: oldOrder } },
            { $inc: { order: 1 } }
        );
    }

    // Cập nhật thứ tự của cột được kéo
    column.order = newOrder;
    await column.save();

    // lấy lại danh sách cột đã được sắp xếp
    const columns = await Column.find({ boardId }).sort({ order: 1 });

    // cập nhật lại thứ tự để đảm bảo tính liên tục
    for (let i = 0; i < columns.length; i++) {
        if (columns[i].order !== i) {
            columns[i].order = i;
            await columns[i].save();
        }
    }

    res.status(200).json({
        success: true,
        message: "Sắp xếp lại cột thành công",
        data: {
            columnId,
            oldOrder,
            newOrder,
            columns: columns.map((col) => ({
                id: col._id,
                title: col.title,
                order: col.order,
            })),
        },
    });
});

module.exports = reorderColumns;
