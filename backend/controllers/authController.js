const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        console.log("Register attempt:", { name, email, role }); 

        const hashed = await bcrypt.hash(password, 10);

  
        const userData = {
            name,
            email,
            passwordHash: hashed,
            role
        };

        if (req.file) {
            const relativePath = path.relative(__dirname, req.file.path);
            userData.faceImage = relativePath;
            console.log("File uploaded:", userData.faceImage);
        }

        const user = await User.create(userData);

        console.log("User created:", user); 
        const safeUser = user.toObject();
        delete safeUser.passwordHash;

        res.json(safeUser);
    } catch(err) {
        console.log("Register error:", err.message); 
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
            process.env.JWT_SECRET, { expiresIn: "7d" }
        );

        const safeUser = user.toObject();
        delete safeUser.passwordHash;
        res.json({ token, user: safeUser });

    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

exports.faceLogin = async (req, res) => {
    res.json({
        message: "Face login placeholder"
    });
};