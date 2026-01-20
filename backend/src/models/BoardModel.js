const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tên bảng không được để trống"],
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        background: {
            type: String,
            default: "bg-blue-700",
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        aiEnabled: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

boardSchema.index({ ownerId: 1, isArchived: 1 });

module.exports = mongoose.model("Board", boardSchema);
