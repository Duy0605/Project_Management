const asyncHandler = require("../../loaders/asyncHandler");
const Activity = require("../../models/ActivityModel");

const getActivities = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { limit = 20, skip = 0 } = req.query;

    const activities = await Activity.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .populate("user", "name email avatarColor")
        .populate("board", "name")
        .populate("task", "title")
        .populate("column", "title")
        .populate("targetUser", "name email avatarColor");

    const total = await Activity.countDocuments({ user: userId });

    // Format activities để trả về frontend
    const formattedActivities = activities.map((activity) => {
        const data = {
            id: activity._id,
            action: activity.action,
            user: {
                name: activity.user.name,
                avatarColor: activity.user.avatarColor,
            },
            time: activity.createdAt,
        };

        if (activity.board) {
            data.boardName = activity.board.name;
            data.boardId = activity.board._id;
        }

        if (activity.task) {
            data.taskName = activity.task.title;
            data.taskId = activity.task._id;
        }

        if (activity.column) {
            console.log("Activity column:", activity.column);
            data.columnTitle = activity.column.title;
            data.columnId = activity.column._id;
        } else {
            console.log(
                "No column in activity:",
                activity._id,
                "action:",
                activity.action,
            );
        }

        if (activity.targetUser) {
            data.targetUser = {
                name: activity.targetUser.name,
                avatarColor: activity.targetUser.avatarColor,
            };
        }

        if (activity.metadata) {
            data.metadata = activity.metadata;

            // board
            if (activity.metadata.boardName) {
                data.boardName = activity.metadata.boardName;
            }

            // column
            if (activity.metadata.columnTitle) {
                data.columnTitle = activity.metadata.columnTitle;
            }

            if (activity.metadata.oldColumnTitle) {
                data.oldColumnTitle = activity.metadata.oldColumnTitle;
            }

            if (activity.metadata.newColumnTitle) {
                data.newColumnTitle = activity.metadata.newColumnTitle;
            }

            // task
            if (activity.metadata.taskTitle) {
                data.taskName = activity.metadata.taskTitle;
            }
        }

        return data;
    });

    res.status(200).json({
        success: true,
        message: "Lấy danh sách hoạt động thành công",
        data: formattedActivities,
        total,
        hasMore: skip + activities.length < total,
    });
});

module.exports = getActivities;
