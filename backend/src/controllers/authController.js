const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const crypto = require("crypto");

const { JWT_SECERET } = require("../config/env");
const sendMail = require("../../services/mail");
const forgotPasswordTemplate = require("../../services/mailTemplate");

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "name, email are required",
            });
        }

        if (password.length < 4) {
            return res.status(400).json({
                message: "Password must be at least 4 characters",
            });
        }

        let exist = await User.findOne({ email });

        if (exist) {
            return res.status(400).json({
                message: "Email already registered",
            });
        }

        const userData = {
            email,
            name,
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        userData.password = hashedPassword;

        const user = await User.create(userData);

        let token = await jwt.sign({ id: user._id, role: user.role }, JWT_SECERET, {
            expiresIn: "7d",
        });

        res.cookie("token", token)

        const userDetail = {
            id: user._id,
            name: user.name,
            email: user.email,
        };

        return res.status(201).json({
            message: "User signed up...",
            userDetail
        });
    } catch (err) {
        console.log("SIGNUP ERROR : ", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        let token = await jwt.sign({ id: user._id }, JWT_SECERET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
        };
        // console.log(token);
        res.status(200).json({
            message: "Login Success",
            userData
        });
    } catch (err) {
        console.log("SIGNUP ERROR : ", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.verifyMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Verification failed",
        });
    }
};

// controllers/auth.controller.js

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Generate Token
        const token = crypto.randomBytes(32).toString("hex");

        // Save token in DB
        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        // Reset Link
        const resetLink = `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`;

        // Send Mail
        await sendMail(
            user.email,
            "Reset Password",
            forgotPasswordTemplate(user.name, resetLink)
        );

        return res.status(200).json({
            success: true,
            message: "Password reset link sent successfully.",
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and Password are required.",
            });
        }

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() },
        }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or Expired Token",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        user.resetToken = undefined;
        user.resetTokenExpire = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};