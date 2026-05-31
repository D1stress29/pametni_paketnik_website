const router = require("express").Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
    const users = await User.find().select("-passwordHash");
    res.json(users);
});

router.get("/me", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id)
        .select("-passwordHash")
        .populate("preferredMailbox");

    if (!user) {
        return res.status(404).json({ message: "Uporabnik ne obstaja." });
    }

    res.json(user);
});

router.put("/me", authMiddleware, async (req, res) => {
    const update = {};
    if (req.body.name !== undefined) update.name = req.body.name;
    if (req.body.email !== undefined) update.email = req.body.email;
    if (req.body.preferredMailbox !== undefined) update.preferredMailbox = req.body.preferredMailbox;

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true })
        .select("-passwordHash")
        .populate("preferredMailbox");

    if (!user) {
        return res.status(404).json({ message: "Uporabnik ne obstaja." });
    }

    res.json(user);
});

router.put("/:id", async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).select("-passwordHash");

    res.json(user);
});

router.delete("/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;