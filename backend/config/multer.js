const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

// Dovoljena MIME tipa za slike obraza
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function safeFolderName(value) {
    return String(value || "unknown")
        .trim()
        .replace(/[^A-Za-z0-9._-]/g, "_")
        .substring(0, 50) // Omeji dolžino
        || "unknown";
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // BUG FIX: pri face-login name/email morda ni v body-ju — fallback na user iz tokena
        const folderName = safeFolderName(
            req.body.name || req.body.email || (req.user && req.user.id) || "unknown"
        );
        const userDir = path.join(__dirname, "../uploads", folderName);

        fs.mkdirSync(userDir, { recursive: true });
        cb(null, userDir);
    },

    filename: (req, file, cb) => {
        // BUG FIX: ext iz originalname ali fallback .jpg
        const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
        cb(null, `face_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        // BUG FIX: zavrnemo ne-slikovne datoteke
        if (ALLOWED_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Nepodprt tip datoteke: ${file.mimetype}. Dovoljeni: JPG, PNG, WEBP.`));
        }
    }
});

module.exports = upload;
