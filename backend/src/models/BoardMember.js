const mongoose = require("mongoose");

const boardMemberSchema = new mongoose.Schema(
    {
        boardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["owner", "member"],
            default: "member",
        },
        lastViewedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("BoardMember", boardMemberSchema);
