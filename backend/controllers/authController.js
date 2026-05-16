const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            passwordHash: hashed,
            role
        });

        res.json(user);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);

        if (!valid) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET
        );

        res.json({ token, user });

    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

exports.faceLogin = async (req, res) => {
    res.json({
        message: "Face login placeholder"
    });
};