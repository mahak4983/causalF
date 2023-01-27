const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        heading: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
);

module.exports = mongoose.model("Blog", blogSchema);
