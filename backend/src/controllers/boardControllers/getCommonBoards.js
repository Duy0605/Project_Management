const asyncHandler = require("../../loaders/asyncHandler");
const BoardMember = require("../../models/BoardMember");

// Lấy danh sách boards chung giữa current user và target user
const getCommonBoards = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;
    const { userId } = req.params; // Target user ID

    // Tìm boards của current user
    const currentUserBoards = await BoardMember.find({
        userId: currentUserId,
    }).select("boardId");
    const currentBoardIds = currentUserBoards.map((b) => b.boardId.toString());

    // Tìm boards của target user
    const targetUserBoards = await BoardMember.find({
        userId: userId,
    }).select("boardId");
    const targetBoardIds = targetUserBoards.map((b) => b.boardId.toString());

    // Tìm boards chung
    const commonBoardIds = currentBoardIds.filter((id) =>
        targetBoardIds.includes(id)
    );

    if (commonBoardIds.length === 0) {
        return res.status(200).json({
            success: true,
            message: "Không có bảng chung",
            count: 0,
            data: [],
        });
    }

    // Lấy thông tin chi tiết của các boards chung
    const commonBoards = await BoardMember.find({
        boardId: { $in: commonBoardIds },
        userId: currentUserId,
    })
        .populate("boardId", "name description background createdAt")
        .select("boardId role");

    res.status(200).json({
        success: true,
        message: "Lấy danh sách bảng chung thành công",
        count: commonBoards.length,
        data: commonBoards.map((member) => ({
            id: member.boardId._id,
            name: member.boardId.name,
            description: member.boardId.description,
            background: member.boardId.background,
            role: member.role,
            createdAt: member.boardId.createdAt,
        })),
    });
});

module.exports = getCommonBoards;
