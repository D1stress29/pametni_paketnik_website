const router         = require("express").Router();
const User           = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ── GET ALL (admin only v produkciji, tukaj brez za enostavnost) ──────────────
router.get("/", authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── GET ME ────────────────────────────────────────────────────────────────────
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-passwordHash")
            .populate("preferredMailbox", "name location isLocked");

        if (!user) return res.status(404).json({ message: "Uporabnik ne obstaja." });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── UPDATE ME ─────────────────────────────────────────────────────────────────
router.put("/me", authMiddleware, async (req, res) => {
    try {
        const update = {};
        // BUG FIX: dovoli samo varne polje — ne role, ne passwordHash
        if (req.body.name             !== undefined) update.name             = req.body.name.trim();
        if (req.body.email            !== undefined) update.email            = req.body.email.trim().toLowerCase();
        if (req.body.preferredMailbox !== undefined) update.preferredMailbox = req.body.preferredMailbox || null;

        const user = await User.findByIdAndUpdate(req.user.id, update, { new: true, runValidators: true })
            .select("-passwordHash")
            .populate("preferredMailbox", "name location isLocked");

        if (!user) return res.status(404).json({ message: "Uporabnik ne obstaja." });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── UPDATE BY ID (admin) ──────────────────────────────────────────────────────
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const update = {};
        if (name  !== undefined) update.name  = name.trim();
        if (email !== undefined) update.email = email.trim().toLowerCase();
        if (role  !== undefined) update.role  = role;

        const user = await User.findByIdAndUpdate(req.params.id, update, { new: true })
            .select("-passwordHash");

        if (!user) return res.status(404).json({ message: "Uporabnik ne obstaja." });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── DELETE BY ID ──────────────────────────────────────────────────────────────
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Uporabnik izbrisan." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
