const Mailbox = require("../models/Mailbox");
const UnlockLog = require("../models/UnlockLog");

exports.getAll = async (req, res) => {
    const mailboxes = await Mailbox.find().populate("owner");
    res.json(mailboxes);
};

exports.create = async (req, res) => {
    const mailbox = await Mailbox.create(req.body);
    res.json(mailbox);
};

exports.update = async (req, res) => {
    const mailbox = await Mailbox.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(mailbox);
};

exports.remove = async (req, res) => {
    await Mailbox.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
};

exports.unlock = async (req, res) => {
    try {
        const mailbox = await Mailbox.findById(req.params.id);
        if (!mailbox) return res.status(404).json({ message: "Mailbox not found" });

        mailbox.isLocked = false;
        await mailbox.save();

        await UnlockLog.create({
            mailbox: mailbox._id,
            user: req.user.id,          // ← iz JWT, ne iz body
            unlockMethod: req.body.method || "mobile-app",
            success: true
        });

        res.json({ message: "Mailbox unlocked" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};