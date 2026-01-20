const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Tên cột là bắt buộc"],
            trim: true,
        },
        boardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
            required: true,
        },
        // Thứ tự hiển thị cột
        order: {
            type: Number,
            default: 0,
        },
    },
    { 
        timestamps: true 
    }
);

columnSchema.index({ boardId: 1, order: 1 });

module.exports = mongoose.model("Column", columnSchema);