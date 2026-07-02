const jwt = require("jsonwebtoken");
const { JWT_SECERET } = require("../config/env");

module.exports = (req, res, next) => {

    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "token missing...",
            });
        }

        const decoded = jwt.verify(token, JWT_SECERET);
        req.user = decoded;
        next()
    } catch (err) {
        res.status(401).json({
            message: `Invalid token ${err}`,
        });
    }

}
