const Mailbox = require("../models/Mailbox");
const UnlockLog = require("../models/UnlockLog");

exports.getAll = async (req, res) => {
    const mailboxes = await Mailbox.find().populate("owner");
    res.json(mailboxes);
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

JavaScript
const Mailbox = require("../models/Mailbox");
const UnlockLog = require("../models/UnlockLog");

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

        // Dodaj nove knjige v seznam
        mailbox.books = [...(mailbox.books || []), ...books];
        await mailbox.save();

        return res.status(200).json({ success: true, message: "Knjige uspešno dodane!", mailbox });
    } catch (error) {
        console.error("Napaka pri dodajanju knjig:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};