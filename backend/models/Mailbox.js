const mongoose = require("mongoose");

const MailboxSchema = new mongoose.Schema({
    name: String,
    location: String,
    deviceId: String,
    isLocked: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [String],
    books: [
        {
            title: { type: String, required: true },
            author: { type: String },
            offeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            offeredAt: { type: Date, default: Date.now },
            interested: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Mailbox", MailboxSchema);