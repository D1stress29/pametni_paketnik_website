const mongoose = require("mongoose");

const UnlockLogSchema = new mongoose.Schema({
    mailbox: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mailbox"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    unlockMethod: String,
    success: Boolean,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("UnlockLog", UnlockLogSchema);