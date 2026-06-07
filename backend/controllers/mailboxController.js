const Mailbox   = require("../models/Mailbox");
const UnlockLog = require("../models/UnlockLog");

// ── ADD BOOKS ─────────────────────────────────────────────────────────────────
exports.addBooks = async (req, res) => {
    try {
        const { id } = req.params;
        const { books } = req.body;

        if (!Array.isArray(books) || books.length === 0) {
            return res.status(400).json({ message: "Ni knjig za dodati." });
        }

        const mailbox = await Mailbox.findById(id);
        if (!mailbox) return res.status(404).json({ message: "Paketnik ni najden." });

        const userId = req.user?.id || req.user?._id;

        // BUG FIX: stroga normalizacija — vsak vnos mora imeti title string
        const normalized = books
            .map(b => {
                let title  = "";
                let author = "";

                if (typeof b === "string") {
                    title = b.trim();
                } else if (b && typeof b === "object") {
                    title  = typeof b.title  === "string" ? b.title.trim()  : "";
                    author = typeof b.author === "string" ? b.author.trim() : "";
                }

                if (!title) return null;

                return {
                    title,
                    author,
                    offeredBy:  userId,
                    interested: [],
                    offeredAt:  new Date()
                };
            })
            .filter(Boolean);

        if (normalized.length === 0) {
            return res.status(400).json({ message: "Vse knjige imajo prazen naslov." });
        }

        mailbox.books.push(...normalized);
        await mailbox.save();

        // Populate za pravilni prikaz v odgovoru
        await mailbox.populate([
            { path: "books.offeredBy",  select: "name email" },
            { path: "books.interested", select: "name email" }
        ]);

        res.status(201).json({ success: true, mailbox });
    } catch (err) {
        console.error("addBooks error:", err);
        res.status(500).json({ error: err.message });
    }
};

// ── DELETE BOOK ───────────────────────────────────────────────────────────────
exports.deleteBook = async (req, res) => {
    try {
        const { id, bookId } = req.params;

        const mailbox = await Mailbox.findById(id);
        if (!mailbox) return res.status(404).json({ message: "Paketnik ni najden." });

        const book = mailbox.books.id(bookId);
        if (!book) return res.status(404).json({ message: "Knjiga ni najdena." });

        // BUG FIX: .remove() je deprecated v novi Mongoose — uporabi pull
        mailbox.books.pull({ _id: bookId });
        await mailbox.save();

        res.json({ success: true, message: "Knjiga odstranjena." });
    } catch (err) {
        console.error("deleteBook error:", err);
        res.status(500).json({ error: err.message });
    }
};

// ── INTEREST BOOK ─────────────────────────────────────────────────────────────
exports.interestBook = async (req, res) => {
    try {
        const { mailboxId, bookId } = req.params;
        const userId = req.user?.id || req.user?._id;

        if (!userId) return res.status(401).json({ message: "Unauthorized." });

        const mailbox = await Mailbox.findById(mailboxId);
        if (!mailbox) return res.status(404).json({ message: "Paketnik ni najden." });

        const book = mailbox.books.id(bookId);
        if (!book) return res.status(404).json({ message: "Knjiga ni najdena." });

        // BUG FIX: String() primerjava za oba ObjectId formata
        const alreadyInterested = book.interested.some(
            i => String(i) === String(userId)
        );

        if (alreadyInterested) {
            // Toggle — odstrani interes
            book.interested = book.interested.filter(
                i => String(i) !== String(userId)
            );
        } else {
            book.interested.push(userId);
        }

        await mailbox.save();

        await mailbox.populate([
            { path: "books.offeredBy",  select: "name email" },
            { path: "books.interested", select: "name email" }
        ]);

        res.json({ success: true, interested: !alreadyInterested, mailbox });
    } catch (err) {
        console.error("interestBook error:", err);
        res.status(500).json({ error: err.message });
    }
};

// ── GET ALL (helper za controller, ruta ga kliče direktno) ────────────────────
exports.getAll = async (req, res) => {
    try {
        const mailboxes = await Mailbox.find()
            .populate("owner", "name email")
            .populate("books.offeredBy",  "name email")
            .populate("books.interested", "name email")
            .sort({ createdAt: -1 });

        res.json(mailboxes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
