const router = require("express").Router();
const controller = require("../controllers/unlockLogController");
const auth = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();
const UnlockLog = require("../models/UnlockLog");


const authMiddleware = require("../middleware/authMiddleware"); 

// Končni URL bo: GET http://localhost:5000/api/unlock-logs/my
router.get("/my", authMiddleware, async (req, res) => {
    try {

        const logs = await UnlockLog.find({ user: req.user._id })
            .populate("mailbox") 
            .sort({ timestamp: -1 });

        return res.status(200).json(logs);
    } catch (error) {
        console.error("Napaka pri pridobivanju zgodovine:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

