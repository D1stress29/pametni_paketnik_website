const express  = require("express");
const jwt      = require("jsonwebtoken");
const mongoose = require("mongoose");
const router   = express.Router();

const Mailbox           = require("../models/Mailbox");
const UnlockLog         = require("../models/UnlockLog");
const authMiddleware    = require("../middleware/authMiddleware");
const mailboxController = require("../controllers/mailboxController");

async function findMailbox(identifier) {
    if (mongoose.Types.ObjectId.isValid(identifier)) {
        const mailbox = await Mailbox.findById(identifier);
        if (mailbox) return mailbox;
    }

    const mailboxByDevice = await Mailbox.findOne({ deviceId: identifier });
    if (mailboxByDevice) return mailboxByDevice;

    // Fallback for mailboxes created without deviceId where the name includes a numeric identifier.
    if (/^\d+$/.test(identifier)) {
        return Mailbox.findOne({ name: new RegExp(`\\b${identifier}\\b`, "i") }).sort({ createdAt: -1 });
    }

    return null;
}

function optionalAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return next();
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        // Ignore invalid/expired token for optional auth.
    }
    next();
}

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
        const mailbox = await findMailbox(req.params.id);
        if (!mailbox) return res.status(404).json({ message: "Paketnik ni najden." });

        await mailbox.populate("owner", "name email");
        await mailbox.populate("books.offeredBy", "name email");
        await mailbox.populate("books.interested", "name email");

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

        const mailbox = await findMailbox(req.params.id);
        if (!mailbox) return res.status(404).json({ message: "Paketnik ni najden." });

        Object.assign(mailbox, update);
        await mailbox.save();
        await mailbox.populate("owner", "name email");

        res.json(mailbox);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── DELETE ───────────────────────────────────────────────────────────────────
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const mailbox = await findMailbox(req.params.id);
        if (!mailbox) return res.status(404).json({ message: "Paketnik ni najden." });

        await Mailbox.findByIdAndDelete(mailbox._id);
        await UnlockLog.deleteMany({ mailbox: mailbox._id });
        res.json({ message: "Paketnik in vsi logi so bili izbrisani." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── UNLOCK ───────────────────────────────────────────────────────────────────
// BUG FIX: prej je req.body.method shranjevalo v log, zdaj req.body.unlockMethod
router.post("/:id/unlock", optionalAuthMiddleware, async (req, res) => {
    try {
        console.log("Unlock request", {
            paramsId: req.params.id,
            body: req.body,
            user: req.user
        });

        let mailbox = await findMailbox(req.params.id);
        if (!mailbox) {
            console.log("Mailbox not found by route id, fallback deviceId", req.body.deviceId);
            if (req.body.deviceId) {
                mailbox = await findMailbox(req.body.deviceId);
            }
        }
        if (!mailbox) {
            console.log("Mailbox still not found", { routeId: req.params.id, deviceId: req.body.deviceId });
            return res.status(404).json({ message: "Paketnik ni najden." });
        }

        console.log("Mailbox found", { id: mailbox._id.toString(), deviceId: mailbox.deviceId });

        mailbox.isLocked = false;
        await mailbox.save();

        const log = await UnlockLog.create({
            mailbox:      mailbox._id,
            user:         req.user?.id || req.body.userId || null,
            unlockMethod: req.body.unlockMethod || req.body.method || "app",
            success:      true,
            timestamp:    new Date()
        });

        console.log("Unlock log created", { logId: log._id.toString(), user: log.user, unlockMethod: log.unlockMethod });
        res.json({ success: true, log, mailbox });
    } catch (err) {
        console.error("Unlock error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ── LOCK (bonus ruta) ─────────────────────────────────────────────────────────
router.post("/:id/lock", authMiddleware, async (req, res) => {
    try {
        const mailbox = await findMailbox(req.params.id);
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
