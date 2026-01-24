const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpire: {
            type: Date,
        },

        avatarColor: {
            type: String,
            default: "bg-gradient-to-br from-blue-500 to-blue-700",
        },

        bio: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("User", userSchema);
