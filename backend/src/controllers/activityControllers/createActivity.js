const Activity = require("../../models/ActivityModel");

const createActivity = async (userId, action, data = {}) => {
    try {
        const activityData = {
            user: userId,
            action,
        };

        if (data.board) activityData.board = data.board;
        if (data.task) activityData.task = data.task;
        if (data.column) activityData.column = data.column;
        if (data.targetUser) activityData.targetUser = data.targetUser;
        if (data.metadata) activityData.metadata = data.metadata;

        await Activity.create(activityData);
    } catch (error) {
        console.error("Create activity error:", error);
    }
};

module.exports = createActivity;
