const Mailbox = require("../models/Mailbox");
const UnlockLog = require("../models/UnlockLog");

exports.getAll = async (req, res) => {
    const mailboxes = await Mailbox.find().populate("owner");
    res.json(mailboxes);
};

// Mark interest by current authenticated user for a specific book subdocument
exports.interestBook = async (req, res) => {
    try {
        const { mailboxId, bookId } = req.params;
        const userId = (req.user && (req.user.id || req.user._id)) || null;

        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const mailbox = await Mailbox.findById(mailboxId);
        if (!mailbox) return res.status(404).json({ success: false, message: "Paketnik ne obstaja." });

        const book = mailbox.books.id(bookId);
        if (!book) return res.status(404).json({ success: false, message: "Knjiga ni najdena." });

        // Avoid duplicates
        const already = (book.interested || []).some(i => String(i) === String(userId));
        if (!already) {
            book.interested = [...(book.interested || []), userId];
            await mailbox.save();
        }

        await mailbox.populate([
            { path: "books.offeredBy", select: "name email" },
            { path: "books.interested", select: "name email" }
        ]);

        return res.status(200).json({ success: true, message: "Interest recorded", mailbox });
    } catch (error) {
        console.error("Napaka pri beleženju interesa:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
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
    // 1. IZPIS PODATKOV V KONZOLO STREŽNIKA
    console.log("==========================================");
    console.log("--> PREJETA ZAHTEVA ZA ODKLEPANJE <--");
    console.log("1. URL parametri (req.params):", req.params);
    console.log("2. Telo zahteve (req.body):", req.body);
    console.log("3. Podatki iz JWT (req.user):", req.user);
    console.log("==========================================");

    try {
        const mailbox = await Mailbox.findById(req.params.id);
        if (!mailbox) {
            console.log("NAPAKA: Paketnik z ID " + req.params.id + " ne obstaja v bazi.");
            return res.status(404).json({ message: "Mailbox not found" });
        }

        mailbox.isLocked = false;
        await mailbox.save();

        // Ugotovimo, kje vse se lahko skriva ID uporabnika
        let prejetiUserId = null;
        if (req.user && req.user.id) prejetiUserId = req.user.id;
        if (req.user && req.user._id) prejetiUserId = req.user._id;
        if (req.body && req.body.userId) prejetiUserId = req.body.userId;

        console.log("Končni ugotovljeni UserId za vnos v bazo:", prejetiUserId);

        // USTVARJANJE LOGA
        const noviLog = await UnlockLog.create({
            mailbox: mailbox._id,
            user: prejetiUserId, // Če je to null, bo Mongoose polje pustil prazno
            unlockMethod: req.body.unlockMethod || "Mobilna aplikacija",
            success: true
        });

        console.log("LOG USPEŠNO ZAPISAN V BAZO:", noviLog);
        res.json({ message: "Mailbox unlocked successfully", log: noviLog });

    } catch (err) {
        console.error("KRITIČNA NAPAKA PRI SHRANJEVANJU:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.addBooks = async (req, res) => {
    try {
        const { id } = req.params;
        const { books } = req.body;

        if (!books || !Array.isArray(books) || books.length === 0) {
            return res.status(400).json({ success: false, message: "Prosim vnesite seznam knjig." });
        }

        const mailbox = await Mailbox.findById(id);
        if (!mailbox) {
            return res.status(404).json({ success: false, message: "Paketnik ne obstaja." });
        }

        // Normalize incoming books: accept either strings or objects { title, author }
        const userId = (req.user && (req.user.id || req.user._id)) || null;
        const normalized = (books || []).map(b => {
            if (typeof b === "string") {
                return { title: b, author: "", offeredBy: userId, interested: [] };
            }

            return {
                title: b.title || "",
                author: b.author || "",
                offeredBy: userId,
                interested: []
            };
        }).filter(x => x.title && x.title.trim() !== "");

        // Dodaj nove knjige v seznam
        mailbox.books = [...(mailbox.books || []), ...normalized];
        await mailbox.save();

        // Populate offeredBy and interested users for response
        await mailbox.populate([
            { path: "books.offeredBy", select: "name email" },
            { path: "books.interested", select: "name email" }
        ]);

        return res.status(200).json({ success: true, message: "Knjige uspešno dodane!", mailbox });
    } catch (error) {
        console.error("Napaka pri dodajanju knjig:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};