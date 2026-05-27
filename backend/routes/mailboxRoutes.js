const express = require("express");
const router = express.Router();
const Mailbox = require("../models/Mailbox");
const UnlockLog = require("../models/UnlockLog");


router.post("/api/mailbox/unlock", async (req, res) => {
    const { deviceId, userId, unlockMethod } = req.body;

    try {
    
        const mailbox = await Mailbox.findOne({ deviceId: deviceId });
        
        if (!mailbox) {
          
            return res.status(404).json({ success: false, message: "Paketnik ne obstaja." });
        }

       
        
        mailbox.isLocked = false;
        await mailbox.save();

       
        const noviLog = new UnlockLog({
            mailbox: mailbox._id,         
            user: userId,                 
            unlockMethod: unlockMethod,  
            success: true              
        });
        await noviLog.save();

        return res.status(200).json({ success: true, message: "Paketnik uspešno odklenjen!" });

    } catch (error) {
        // Če gre kaj narobe, lahko še vedno shraniš NEUSPEŠEN poskus logiranja (če želiš)
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;