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
    const mailbox = await Mailbox.findById(req.params.id);

    mailbox.isLocked = false;
    await mailbox.save();

    await UnlockLog.create({
        mailbox: mailbox._id,
        user: req.body.userId,
        unlockMethod: req.body.method,
        success: true
    });

    res.json({
        message: "Mailbox unlocked"
    });
};