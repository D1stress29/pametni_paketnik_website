const path = require("path");
const fs = require("fs");
const multer = require("multer");
const router = require("express").Router();
const controller = require("../controllers/authController");

function safeFolderName(name) {
  return name.trim().replace(/[^A-Za-z0-9._-]/g, "_") || "unknown_user";
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userFolder = safeFolderName(req.body.name);
    const uploadDir = path.join(__dirname, "../uploads", userFolder);

    fs.mkdirSync(uploadDir, { recursive: true });

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `face_${Date.now()}${path.extname(file.originalname) || ".jpg"}`);
  }
});

const upload = multer({ storage });

router.post("/register", upload.single("faceImage"), controller.register);
router.post("/login", controller.login);
router.post("/face-login", controller.faceLogin);

module.exports = router;