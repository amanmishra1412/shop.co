const { signup, login, getMe, verifyMe, logout, forgotPassword, resetPassword } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("auth route running");
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-me", authMiddleware, verifyMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

module.exports = router
