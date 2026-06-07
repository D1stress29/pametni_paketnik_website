const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: {
        type:     String,
        required: true,
        trim:     true,
        set:      v => (typeof v === "string" ? v.trim() : "")
    },
    author: {
        type:    String,
        default: "",
        trim:    true
    },
    offeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User"
    },
    offeredAt: {
        type:    Date,
        default: Date.now
    },
    interested: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User"
    }]
});

const MailboxSchema = new mongoose.Schema({
    name: {
        type:     String,
        required: true,
        trim:     true
    },
    location: {
        type:    String,
        default: "",
        trim:    true
    },
    deviceId: {
        type:    String,
        default: "",
        trim:    true
    },
    isLocked: {
        type:    Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User"
    },
    // BUG FIX: items je bil [String] brez validacije — pustimo za združljivost
    items: [String],
    books: [BookSchema]

}, { timestamps: true });

module.exports = mongoose.model("Mailbox", MailboxSchema);
