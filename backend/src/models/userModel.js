const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: false,
        },

        // OAuth
        googleId: { type: String, unique: true, sparse: true },
        authProvider: { type: String, enum: ['local', 'google'], default: 'local' },

        resetToken: String,

        resetTokenExpire: Date,

    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("User", userSchema);