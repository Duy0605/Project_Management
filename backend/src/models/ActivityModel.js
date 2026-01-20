const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        action: {
            type: String,
            required: true,
            enum: [
                "created_board",
                "closed_board",
                "reopened_board",
                "deleted_board",
                "updated_board",
                "created_column",
                "updated_column",
                "deleted_column",
                "created_task",
                "updated_task",
                "deleted_task",
                "completed_task",
                "uncompleted_task",
                "assigned_task",
                "unassigned_task",
                "added_member",
                "removed_member",
            ],
        },

        board: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
        },

        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        },

        column: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Column",
        },

        targetUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    },
);

// Index để query nhanh hơn
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ board: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);
