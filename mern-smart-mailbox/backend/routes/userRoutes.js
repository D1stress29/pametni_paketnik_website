const router = require("express").Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.put("/:id", async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(user);
});

router.delete("/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;