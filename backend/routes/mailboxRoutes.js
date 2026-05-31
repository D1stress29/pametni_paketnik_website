const express = require("express");
const router = express.Router();
const Mailbox = require("../models/Mailbox");
const UnlockLog = require("../models/UnlockLog");
const authMiddleware = require("../middleware/authMiddleware");
const mailboxController = require("../controllers/mailboxController");

router.get("/", async (req, res) => {
    try {
        const mailboxes = await Mailbox.find({})
            .populate("owner", "name email");
        return res.status(200).json(mailboxes);
    } catch (error) {
        console.error("Napaka pri branju paketnikov:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.post("/:id/unlock", authMiddleware, async (req, res) => {
    const { id } = req.params; 
    
    const končniUserId = (req.user ? req.user.id : null) || req.body.userId;
    const metodaOdklepa = req.body.unlockMethod || "Aplikacija";

    try {
        // 1. Pretvorba v številko pred iskanjem v bazi
        const numericId = Number(id) || Number(req.body.deviceId);
        let mailbox = await Mailbox.findOne({ boxId: numericId });
        
        // 2. ČE PAKETNIK NE OBSTAJA, GA USTVARIMO NA HITRO
        if (!mailbox) {
            console.log(`-> Paketnik ${numericId} ne obstaja. Ustvarjam nov paketnik v bazi...`);
            
            mailbox = new Mailbox({
                boxId: numericId,
                name: `Paketnik ${numericId}`, // Avtomatsko ime
                isLocked: false,               // Ker ga ravno odpiramo, je odklenjen
                owner: končniUserId            // Nastavimo trenutnega uporabnika kot lastnika
            });
            
            await mailbox.save();
            console.log(`-> Nov paketnik uspešno dodan:`, mailbox);
        } else {
            // Če paketnik že obstaja, mu samo posodobimo stanje
            mailbox.isLocked = false;
            await mailbox.save();
        }

        // 3. Shranjevanje loga za odklepanje (sedaj bo vedno delovalo, saj 'mailbox._id' zagotovo obstaja)
        const noviLog = new UnlockLog({
            mailbox: mailbox._id,
            user: končniUserId,
            unlockMethod: metodaOdklepa,
            success: true
        });
        await noviLog.save();

        console.log("LOG USPEŠNO ZAPISAN V BAZO:", noviLog);
        return res.status(200).json({ success: true, message: "Paketnik uspešno registriran in odklenjen!" });

    } catch (error) {
        console.error("Napaka pri odklepanju/ustvarjanju paketnika:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.post("/:id/books", authMiddleware, mailboxController.addBooks);

module.exports = router;