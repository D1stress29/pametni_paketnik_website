const express = require("express");
const router = express.Router();
const Mailbox = require("../models/Mailbox");
const UnlockLog = require("../models/UnlockLog");


router.get("/", async (req, res) => {
    try {
        const mailboxes = await Mailbox.find({});
        return res.status(200).json(mailboxes);
    } catch (error) {
        console.error("Napaka pri branju paketnikov:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});


router.post("/:id/unlock", async (req, res) => {
    const { id } = req.params; 
    const { method } = req.body; 
    const userId = req.user ? req.user._id : null;

    console.log(`--> API POKLICAN! Odklepam paketnik z ID: ${id}`);

    try {
        const mailbox = await Mailbox.findOne({ boxId: req.body.scannedBoxId });
        
        if (!mailbox) {
            return res.status(404).json({ success: false, message: "Paketnik ne obstaja." });
        }

        mailbox.isLocked = false;
        await mailbox.save();

        const noviLog = new UnlockLog({
            mailbox: mailbox._id,         
            user: userId,                 
            unlockMethod: method || "mobile-app",  
            success: true              
        });
        await noviLog.save();

        return res.status(200).json({ success: true, message: "Paketnik uspešno odklenjen!" });

    } catch (error) {
        console.error("Napaka pri odklepanju:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;