const express = require("express");
const router  = express.Router();

const Mailbox           = require("../models/Mailbox");
const UnlockLog         = require("../models/UnlockLog");
const authMiddleware    = require("../middleware/authMiddleware");
const mailboxController = require("../controllers/mailboxController");

// ── GET ALL ──────────────────────────────────────────────────────────────────
// BUG FIX: bila je brez avtentikacije — zdaj opcijsko (javni prikaz je ok,
//          ampak populate deluje enako; pustimo brez auth ker Dashboard
//          pokliče to ruto brez tokena pri prvem renderu)
router.get("/", async (req, res) => {
    try {
        const mailboxes = await Mailbox.find()
            .populate("owner", "name email")
            .populate("books.offeredBy", "name email")
            .populate("books.interested", "name email")
            .sort({ createdAt: -1 });

        // Čisto filtriramo knjige: samo objekti z veljavnim title stringom
        const cleaned = mailboxes.map(m => {
            const obj = m.toObject();
            obj.books = (obj.books || []).filter(
                b => b && typeof b.title === "string" && b.title.trim() !== ""
            ).map(b => ({
                _id:        b._id,
                title:      b.title.trim(),
                author:     (b.author || "").trim(),
                offeredBy:  b.offeredBy  || null,
                interested: b.interested || [],
                offeredAt:  b.offeredAt
            }));
            return obj;
        });

        res.json(cleaned);
    } catch (err) {
        console.error("GET /mailboxes error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ── GET ONE ──────────────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
    try {
        const mailbox = await Mailbox.findById(req.params.id)
            .populate("owner", "name email")
            .populate("books.offeredBy", "name email")
            .populate("books.interested", "name email");

        if (!mailbox) return res.status(404).json({ message: "Paketnik ni najden." });
        res.json(mailbox);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── CREATE (samo admin ali authenticated user) ────────────────────────────────
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, location, deviceId } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Ime paketnika je obvezno." });
        }

        const mailbox = await Mailbox.create({
            name:     name.trim(),
            location: (location || "").trim(),
            deviceId: (deviceId || "").trim(),
            owner:    req.user.id,   // lastnik = prijavljen uporabnik
            isLocked: true
        });

        res.status(201).json(mailbox);
    } catch (err) {
        console.error("POST /mailboxes error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ── UPDATE ───────────────────────────────────────────────────────────────────
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { name, location, deviceId, isLocked } = req.body;
        const update = {};
        if (name      !== undefined) update.name      = name.trim();
        if (location  !== undefined) update.location  = location.trim();
        if (deviceId  !== undefined) update.deviceId  = deviceId.trim();
        if (isLocked  !== undefined) update.isLocked  = isLocked;

        const mailbox = await Mailbox.findByIdAndUpdate(
            req.params.id, update, { new: true }
        ).populate("owner", "name email");

        if (!mailbox) return res.status(404).json({ message: "Paketnik ni najden." });
        res.json(mailbox);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── DELETE ───────────────────────────────────────────────────────────────────
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Mailbox.findByIdAndDelete(req.params.id);
        await UnlockLog.deleteMany({ mailbox: req.params.id });
        res.json({ message: "Paketnik in vsi logi so bili izbrisani." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── UNLOCK ───────────────────────────────────────────────────────────────────
// BUG FIX: prej je req.body.method shranjevalo v log, zdaj req.body.unlockMethod
router.post("/:id/unlock", authMiddleware, async (req, res) => {
    try {
        const mailbox = await Mailbox.findById(req.params.id);
        if (!mailbox) return res.status(404).json({ message: "Paketnik ni najden." });

        mailbox.isLocked = false;
        await mailbox.save();

        const log = await UnlockLog.create({
            mailbox:      mailbox._id,
            user:         req.user.id,
            unlockMethod: req.body.unlockMethod || req.body.method || "app",
            success:      true,
            timestamp:    new Date()
        });

        res.json({ success: true, log, mailbox });
    } catch (err) {
        console.error("Unlock error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ── LOCK (bonus ruta) ─────────────────────────────────────────────────────────
router.post("/:id/lock", authMiddleware, async (req, res) => {
    try {
        const mailbox = await Mailbox.findById(req.params.id);
        if (!mailbox) return res.status(404).json({ message: "Paketnik ni najden." });

        mailbox.isLocked = true;
        await mailbox.save();
        res.json({ success: true, mailbox });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── ADD BOOKS ─────────────────────────────────────────────────────────────────
router.post("/:id/books", authMiddleware, mailboxController.addBooks);

// ── DELETE BOOK ───────────────────────────────────────────────────────────────
router.delete("/:id/books/:bookId", authMiddleware, mailboxController.deleteBook);

// ── INTEREST ──────────────────────────────────────────────────────────────────
router.post("/:mailboxId/books/:bookId/interest", authMiddleware, mailboxController.interestBook);

module.exports = router;
