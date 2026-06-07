const mongoose = require("mongoose");

const UnlockLogSchema = new mongoose.Schema({
    mailbox: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Mailbox",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User"
        // ni required — naprava brez prijavljenega userja lahko tudi odklene
    },
    unlockMethod: {
        type:    String,
        default: "app",
        trim:    true
        // vrednosti: "app", "face", "pin", "manual", "mobile-app" …
    },
    success: {
        type:    Boolean,
        default: true
    },
    timestamp: {
        type:    Date,
        default: Date.now,
        index:   true   // BUG FIX: index za hitrejše sortiranje po datumu
    }
});

module.exports = mongoose.model("UnlockLog", UnlockLogSchema);
