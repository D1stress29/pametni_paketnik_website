const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const mailboxRoutes = require("./routes/mailboxRoutes");
const unlockLogRoutes = require("./routes/unlockLogRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mailboxes", mailboxRoutes);
app.use("/api/unlock-logs", unlockLogRoutes);


app.use((req, res, next) => {
    console.log(`[RADAR] Prejet klic: ${req.method} ${req.url}`);
    next();
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});