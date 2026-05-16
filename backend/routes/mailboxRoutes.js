const router = require("express").Router();
const controller = require("../controllers/mailboxController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, controller.getAll);
router.post("/", auth, controller.create);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.remove);
router.post("/:id/unlock", auth, controller.unlock);

module.exports = router;