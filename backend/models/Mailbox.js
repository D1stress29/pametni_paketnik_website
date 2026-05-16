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
    }
}, { timestamps: true });

module.exports = mongoose.model("Mailbox", MailboxSchema);