const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const authenticateuser = async (req, res, next) => {
    try {
        const authheader = req.headers.authorization;

        if (!authheader) {
            return res.status(401).json({
                message: "Authentication token required"
            });
        }

        const token = authheader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid authentication format"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const result = await pool.query(
            "SELECT id, name, email, role, status FROM users WHERE id = $1",
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const user = result.rows[0];

        if (user.status === "blocked") {
            return res.status(403).json({
                message: "Your account has been blocked"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log(error); 
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateuser;