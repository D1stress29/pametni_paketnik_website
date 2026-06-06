const multer = require("multer");
const path = require("path");
const fs = require("fs");


function safeFolderName(value) {
  return String(value || "unknown_user")
    .trim()
    .replace(/[^A-Za-z0-9._-]/g, "_") || "unknown_user";
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderName = safeFolderName(req.body.name || req.body.email);
        const userDir = path.join(__dirname, "../uploads", folderName);

        fs.mkdirSync(userDir, { recursive: true });

        cb(null, userDir);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || ".jpg";

        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1e9);

        cb(null, `face_${timestamp}_${random}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

module.exports = upload;