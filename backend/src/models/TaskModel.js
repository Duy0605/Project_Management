const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        columnId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Column",
            required: true,
        },
        boardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
            required: true,
        },
        assignees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                default: null,
                ref: "User",
            },
        ],
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
        },
        // thứ tự trong cột
        order: {
            type: Number,
            required: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

taskSchema.index({ boardId: 1, columnId: 1, order: 1 });
taskSchema.index({ assignees: 1 });
taskSchema.index({ startDate: 1 });
taskSchema.index({ endDate: 1 });

module.exports = mongoose.model("Task", taskSchema);
