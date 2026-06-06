const path = require("path");
const fs = require("fs");
const upload = require("../config/multer");
const router = require("express").Router();
const controller = require("../controllers/authController");

router.post("/register", upload.single("faceImage"), controller.register);
router.post("/login", controller.login);
router.post("/face-login", upload.single("faceImage"),controller.faceLogin);

module.exports = router;
