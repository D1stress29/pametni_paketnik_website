const router = require("express").Router();
const controller = require("../controllers/unlockLogController");
const auth = require("../middleware/authMiddleware");

router.get("/my", auth, controller.getMy);
router.get("/", auth, controller.getAll);

module.exports = router;