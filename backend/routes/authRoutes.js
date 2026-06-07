const router     = require("express").Router();
const upload     = require("../config/multer");
const controller = require("../controllers/authController");

// BUG FIX: multer error handling wrapper — brez tega multer napaka crashne server
function handleUpload(field) {
    return (req, res, next) => {
        upload.single(field)(req, res, (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    };
}

router.post("/register",   handleUpload("faceImage"), controller.register);
router.post("/login",      controller.login);
router.post("/face-login", handleUpload("faceImage"), controller.faceLogin);

module.exports = router;
