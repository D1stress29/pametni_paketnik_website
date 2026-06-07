const User       = require("../models/User");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const path       = require("path");
const verifyFace = require("./verifyFace");

// ── REGISTER ──────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Ime, email in geslo so obvezni." });
        }

        // BUG FIX: preveri ali email že obstaja — Mongoose vrže cryptic error
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Uporabnik s tem emailom že obstaja." });
        }

        const hashed = await bcrypt.hash(password, 10);

        // BUG FIX: role whitelist — ne pustimo poljubne vloge iz body-ja
        const allowedRoles = ["owner", "courier", "family"];
        const safeRole = allowedRoles.includes(role) ? role : "family";

        const userData = {
            name:         name.trim(),
            email:        email.trim().toLowerCase(),
            passwordHash: hashed,
            role:         safeRole
        };

        if (req.file) {
            // BUG FIX: shrani relativno pot od backend root, ne absolutno
            userData.faceImage = path.relative(
                path.join(__dirname, ".."),
                req.file.path
            ).replace(/\\/g, "/"); // Windows path fix
        }

        const user = await User.create(userData);
        const safeUser = user.toObject();
        delete safeUser.passwordHash;

        res.status(201).json(safeUser);
    } catch (err) {
        console.error("Register error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email in geslo sta obvezna." });
        }

        // BUG FIX: email lowercase pri iskanju
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "Uporabnik ne obstaja." });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(400).json({ message: "Napačno geslo." });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const safeUser = user.toObject();
        delete safeUser.passwordHash;

        res.json({ token, user: safeUser });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: err.message });
    }
};

// ── FACE LOGIN ────────────────────────────────────────────────────────────────
exports.faceLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password || !req.file) {
            return res.status(400).json({ message: "Email, geslo in slika obraza so obvezni." });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "Uporabnik ne obstaja." });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(400).json({ message: "Napačno geslo." });
        }

        if (!user.faceImage) {
            return res.status(400).json({ message: "Slika obraza ni registrirana za tega uporabnika." });
        }

        const registeredImagePath = path.join(__dirname, "..", user.faceImage);
        const selfiePath          = req.file.path;

        // BUG FIX: verifyFace napaka ne sme crashati celoten login
        let verifyResult = { verified: false, error: "Face verification skipped" };
        try {
            verifyResult = await verifyFace(registeredImagePath, selfiePath);
        } catch (faceErr) {
            console.warn("Face verify service nedosegljiv:", faceErr.message);
            // Ne blokiramo — pošljemo verified:false naprej
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const safeUser = user.toObject();
        delete safeUser.passwordHash;

        res.json({ token, user: safeUser, faceVerification: verifyResult });
    } catch (err) {
        console.error("FaceLogin error:", err);
        res.status(500).json({ error: err.message });
    }
};
