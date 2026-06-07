const express = require("express");
const router = express.Router();

const Mailbox = require("../models/Mailbox");
const UnlockLog = require("../models/UnlockLog");

const authMiddleware = require("../middleware/authMiddleware");
const mailboxController = require("../controllers/mailboxController");



router.get("/", async (req, res) => {
    try {
        const mailboxes = await Mailbox.find()
            .populate("owner", "name email")
            .populate("books.offeredBy", "name email")
            .populate("books.interested", "name email");

        const cleaned = mailboxes.map(m => ({
            ...m.toObject(),
            books: (m.books || []).filter(b =>
                b && typeof b.title === "string"
            ).map(b => ({
                _id: b._id,
                title: b.title,
                author: b.author || "",
                offeredBy: b.offeredBy,
                interested: b.interested || []
            }))
        }));

        res.json(cleaned);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// FIXED UNLOCK (no boxId bug)
router.post("/:id/unlock", authMiddleware, async (req, res) => {
    try {
        const mailbox = await Mailbox.findById(req.params.id);

        if (!mailbox)
            return res.status(404).json({ message: "Mailbox not found" });

        mailbox.isLocked = false;
        await mailbox.save();

        const log = await UnlockLog.create({
            mailbox: mailbox._id,
            user: req.user?.id,
            unlockMethod: req.body.unlockMethod || "app",
            success: true
        });

        res.json({ success: true, log });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD BOOKS
router.post("/:id/books", authMiddleware, mailboxController.addBooks);

// INTEREST
router.post("/:mailboxId/books/:bookId/interest", authMiddleware, mailboxController.interestBook);

module.exports = router;