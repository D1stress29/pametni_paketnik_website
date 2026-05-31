const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Mailbox = require("../models/Mailbox");
const UnlockLog = require("../models/UnlockLog");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.use(protect, adminOnly);

// STATISTIKE
router.get("/stats", async (req, res) => {
    try {
        const [totalUsers, totalMailboxes, totalLogs, recentLogs, successLogs] = await Promise.all([
            User.countDocuments(),
            Mailbox.countDocuments(),
            UnlockLog.countDocuments(),
            UnlockLog.countDocuments({ timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
            UnlockLog.countDocuments({ success: true })
        ]);
        res.json({
            totalUsers, totalMailboxes, totalLogs, recentLogs,
            successRate: totalLogs > 0 ? Math.round((successLogs / totalLogs) * 100) : 0
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPORABNIKI
router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/users/:id", async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { name, email, role }, { new: true }).select("-passwordHash");
        if (!user) return res.status(404).json({ message: "Uporabnik ni najden." });
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/users/:id", async (req, res) => {
    try {
        if (req.params.id === req.user.id) return res.status(400).json({ message: "Ne moreš izbrisati svojega računa." });
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Uporabnik izbrisan." });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PAKETNIKI
router.get("/mailboxes", async (req, res) => {
    try {
        const mailboxes = await Mailbox.find().populate("owner", "name email").sort({ createdAt: -1 });
        res.json(mailboxes);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/mailboxes", async (req, res) => {
    try {
        const { name, location, deviceId, owner } = req.body;
        const mailbox = await Mailbox.create({ name, location, deviceId, owner: owner || null });
        res.status(201).json(mailbox);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/mailboxes/:id", async (req, res) => {
    try {
        const { name, location, deviceId, isLocked, owner } = req.body;
        const mailbox = await Mailbox.findByIdAndUpdate(req.params.id, { name, location, deviceId, isLocked, owner }, { new: true }).populate("owner", "name email");
        if (!mailbox) return res.status(404).json({ message: "Paketnik ni najden." });
        res.json(mailbox);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/mailboxes/:id", async (req, res) => {
    try {
        await Mailbox.findByIdAndDelete(req.params.id);
        await UnlockLog.deleteMany({ mailbox: req.params.id });
        res.json({ message: "Paketnik in vsi njegovi logi so bili izbrisani." });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// LOGI
router.get("/logs", async (req, res) => {
    try {
        const { page = 1, limit = 20, mailboxId, userId } = req.query;
        const filter = {};
        if (mailboxId) filter.mailbox = mailboxId;
        if (userId) filter.user = userId;
        const [logs, total] = await Promise.all([
            UnlockLog.find(filter)
                .populate("mailbox", "name location")
                .populate("user", "name email role")
                .sort({ timestamp: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit)),
            UnlockLog.countDocuments(filter)
        ]);
        res.json({ logs, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/logs/:id", async (req, res) => {
    try {
        await UnlockLog.findByIdAndDelete(req.params.id);
        res.json({ message: "Log izbrisan." });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;