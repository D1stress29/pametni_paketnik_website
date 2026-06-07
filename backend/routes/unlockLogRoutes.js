const express        = require("express");
const router         = express.Router();
const UnlockLog      = require("../models/UnlockLog");
const authMiddleware = require("../middleware/authMiddleware");

// ── GET MY LOGS ───────────────────────────────────────────────────────────────
router.get("/my", authMiddleware, async (req, res) => {
    try {
        const logs = await UnlockLog.find({ user: req.user.id })
            .populate("mailbox", "name location")
            .populate("user",    "name email")
            .sort({ timestamp: -1 })
            .limit(100); // Zaščita pred ogromnim odgovorom

        res.json(logs);
    } catch (err) {
        console.error("GET /unlock-logs/my error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ── GET ALL (paginiran, brez auth — admin ruta to pokrije z authMiddleware) ───
// BUG FIX: dodana pagniacija in populate user polja
router.get("/", authMiddleware, async (req, res) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 20);

        const [logs, total] = await Promise.all([
            UnlockLog.find()
                .populate("mailbox", "name location")
                .populate("user",    "name email role")
                .sort({ timestamp: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            UnlockLog.countDocuments()
        ]);

        res.json({ logs, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── CREATE LOG (za ročno beleženje iz naprave) ────────────────────────────────
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { mailbox, unlockMethod, success } = req.body;

        if (!mailbox) {
            return res.status(400).json({ message: "mailbox ID je obvezen." });
        }

        const log = await UnlockLog.create({
            mailbox,
            user:         req.user.id,
            unlockMethod: unlockMethod || "manual",
            success:      success !== undefined ? success : true,
            timestamp:    new Date()
        });

        res.status(201).json(log);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
