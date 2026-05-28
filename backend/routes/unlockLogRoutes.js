const express = require("express");
const router = express.Router();
const UnlockLog = require("../models/UnlockLog");
const authMiddleware = require("../middleware/authMiddleware"); 

// Končni URL: GET http://localhost:5000/api/unlock-logs/my
router.get("/my", authMiddleware, async (req, res) => {
    
    // 1. DODAJVA TA LOG, DA VIDIVA, ČE JE KLIC SPLOH PRIŠEL SEM!
    console.log("--> API ZA ZGODOVINO POKLICAN! Uporabnik ID:", req.user?.id);

    try {
        const logs = await UnlockLog.find({ user: req.user.id })
            .populate("mailbox") 
            .sort({ timestamp: -1 });

        console.log(`Najdenih logov v bazi: ${logs.length}`);
        return res.status(200).json(logs);
    } catch (error) {
        console.error("Napaka znotraj zgodovina rute:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;