const UnlockLog = require("../models/UnlockLog");

exports.getAll = async (req, res) => {
    const logs = await UnlockLog.find()
        .populate("user")
        .populate("mailbox");

    res.json(logs);
};