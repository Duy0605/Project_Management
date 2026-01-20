const asyncHandler = require("../loaders/asyncHandler");
const Board = require("../models/BoardModel");
const BoardMember = require("../models/BoardMember");
const Column = require("../models/ColumnModel");
const Task = require("../models/TaskModel");

// kiểm tra user có phải owner của board không
const isOwner = asyncHandler(async (req, res, next) => {
    const { boardId } = req.params;

    const board = await Board.findById(boardId);

    if (!board) {
        return res.status(404).json({
            success: false,
            message: "Bảng không tồn tại",
        });
    }

    // Kiểm tra nếu user là owner trong Board model (người tạo board)
    if (board.ownerId.toString() === req.user._id.toString()) {
        req.board = board;
        return next();
    }

    // Hoặc kiểm tra nếu user có role "owner" trong BoardMember
    const memberRole = await BoardMember.findOne({
        boardId,
        userId: req.user._id,
        role: "owner",
    });

    if (memberRole) {
        req.board = board;
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện thao tác này",
    });
});

// kiểm tra user có phải thành viên của board không
const isMember = asyncHandler(async (req, res, next) => {
    const { boardId, columnId, taskId } = req.params;

    // Nếu chỉ có taskId, lấy boardId từ task
    if (taskId && !boardId) {
        const task = await Task.findById(taskId);
        // Kiểm tra nếu task không tồn tại
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task không tồn tại",
            });
        }
        req.boardId = task.boardId;
    }

    // Nếu chỉ có columnId, lấy boardId từ column
    if (columnId && !boardId) {
        const column = await Column.findById(columnId);
        // Kiểm tra nếu column không tồn tại
        if (!column) {
            return res.status(404).json({
                success: false,
                message: "Cột không tồn tại",
            });
        }
        req.boardId = column.boardId;
    }
    // Nếu có cả boardId trong params thì dùng luôn
    else if (boardId) {
        req.boardId = boardId;
    }

    const member = await BoardMember.findOne({
        boardId: req.boardId || boardId,
        userId: req.user._id,
    });

    if (!member) {
        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền truy cập bảng này",
        });
    }
    req.memberRole = member.role;
    next();
});

module.exports = {
    isOwner,
    isMember,
};
