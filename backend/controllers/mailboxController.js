const Mailbox = require("../models/Mailbox");
const UnlockLog = require("../models/UnlockLog");

// GET ALL MAILBOXES
exports.getAll = async (req, res) => {
    try {
        const mailboxes = await Mailbox.find()
            .populate("owner", "name email")
            .populate("books.offeredBy", "name email")
            .populate("books.interested", "name email");

        res.json(mailboxes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// INTEREST BOOK
exports.interestBook = async (req, res) => {
    try {
        const { mailboxId, bookId } = req.params;
        const userId = req.user?.id || req.user?._id;

        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });

        const mailbox = await Mailbox.findById(mailboxId);
        if (!mailbox)
            return res.status(404).json({ message: "Mailbox not found" });

        const book = mailbox.books.id(bookId);
        if (!book)
            return res.status(404).json({ message: "Book not found" });

        const already = book.interested.some(i => String(i) === String(userId));

        if (!already) {
            book.interested.push(userId);
            await mailbox.save();
        }

        await mailbox.populate([
            { path: "books.offeredBy", select: "name email" },
            { path: "books.interested", select: "name email" }
        ]);

        res.json({ success: true, mailbox });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ADD BOOKS (FIXED VALIDATION BUG)
exports.addBooks = async (req, res) => {
    try {
        const { id } = req.params;
        const { books } = req.body;

        if (!Array.isArray(books) || books.length === 0) {
            return res.status(400).json({ message: "No books provided" });
        }

        const mailbox = await Mailbox.findById(id);
        if (!mailbox) {
            return res.status(404).json({ message: "Mailbox not found" });
        }

        const userId = req.user?.id || req.user?._id;

        const normalized = books
    .map(b => {
        let title = "";
        let author = "";

        if (typeof b === "string") {
            title = b;
        } else if (typeof b === "object" && b !== null) {
            title = b.title;
            author = b.author;
        }

        // 🔥 HARD SAFETY CHECK
        if (!title || typeof title !== "string") return null;

        return {
            title: String(title).trim(),
            author: String(author || "").trim(),
            offeredBy: userId,
            interested: []
        };
    })
    .filter(Boolean);

        mailbox.books.push(...normalized);
        await mailbox.save();

        await mailbox.populate([
            { path: "books.offeredBy", select: "name email" },
            { path: "books.interested", select: "name email" }
        ]);

        res.json({ success: true, mailbox });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};