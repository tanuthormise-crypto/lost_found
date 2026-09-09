const pool = require("../config/db");

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, phone, role, status, created_at
             FROM users
             ORDER BY created_at DESC`
        );

        res.status(200).json({
            users: result.rows
        });

    } catch (error) {
        console.log("Get all users error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Check valid status
        if (status !== "active" && status !== "blocked") {
            return res.status(400).json({
                message: "Status must be active or blocked"
            });
        }

        // Check user exists
        const userResult = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Prevent admin from blocking themselves
        if (Number(id) === Number(req.user.id)) {
            return res.status(400).json({
                message: "You cannot change your own status"
            });
        }

        const result = await pool.query(
            `UPDATE users
             SET status = $1
             WHERE id = $2
             RETURNING id, name, email, phone, role, status`,
            [status, id]
        );

        res.status(200).json({
            message: `User ${status} successfully`,
            user: result.rows[0]
        });

    } catch (error) {
        console.log("Update user status error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getAllUsers,updateUserStatus
};