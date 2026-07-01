const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { JWT_SECERET } = require("../config/env");

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