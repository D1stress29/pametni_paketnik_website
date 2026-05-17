const UnlockLog = require("../models/UnlockLog");

// GET /api/unlock-logs — vse (admin)
exports.getAll = async (req, res) => {
    try {
        const filter = {};
        if (req.query.mailboxId) filter.mailbox = req.query.mailboxId;
        if (req.query.userId) filter.user = req.query.userId;

        const logs = await UnlockLog.find(filter)
            .populate("user", "name email")
            .populate("mailbox", "name location")
            .sort({ timestamp: -1 });

        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/unlock-logs/my — samo moji logi (iz JWT)
exports.getMy = async (req, res) => {
    try {
        const logs = await UnlockLog.find({ user: req.user.id })
            .populate("mailbox", "name location")
            .sort({ timestamp: -1 });

        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};