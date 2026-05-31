const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: {
        type: String,
        enum: ["owner", "courier", "family"],
        default: "family"
    },
    faceImage: String,
    preferredMailbox: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mailbox"
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);