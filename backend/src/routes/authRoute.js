const { signup, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("auth route running");
});

router.post("/signup", signup);
router.post("/login", login);

module.exports = router
