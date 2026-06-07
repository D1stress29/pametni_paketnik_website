const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type:     String,
        required: true,
        trim:     true
    },
    email: {
        type:      String,
        required:  true,
        unique:    true,
        lowercase: true,  // BUG FIX: vedno shranjuj lowercase
        trim:      true
    },
    passwordHash: {
        type:     String,
        required: true
    },
    role: {
        type:    String,
        enum:    ["owner", "courier", "family", "admin"],
        default: "family"
    },
    faceImage: {
        type: String
        // relativna pot od backend root, npr. "uploads/ime/face_123.jpg"
    },
    preferredMailbox: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Mailbox"
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
