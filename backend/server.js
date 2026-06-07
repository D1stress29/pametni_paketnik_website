const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes      = require("./routes/authRoutes");
const userRoutes      = require("./routes/userRoutes");
const mailboxRoutes   = require("./routes/mailboxRoutes");
const unlockLogRoutes = require("./routes/unlockLogRoutes");
const adminRoutes     = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// BUG FIX: logger mora biti PRED rutami, ne za njimi
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use("/api/auth",        authRoutes);
app.use("/api/users",       userRoutes);
app.use("/api/mailboxes",   mailboxRoutes);
app.use("/api/unlock-logs", unlockLogRoutes);
app.use("/api/admin",       adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
