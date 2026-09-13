const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
    try {
        const usersResult = await pool.query(
            "SELECT COUNT(*) FROM users"
        );

        const itemsResult = await pool.query(
            `SELECT
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE type = 'lost') AS lost,
                COUNT(*) FILTER (WHERE type = 'found') AS found,
                COUNT(*) FILTER (WHERE status = 'open') AS open,
                COUNT(*) FILTER (WHERE status = 'claimed') AS claimed
             FROM items`
        );

        const claimsResult = await pool.query(
            `SELECT
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE status = 'pending') AS pending,
                COUNT(*) FILTER (WHERE status = 'approved') AS approved,
                COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
             FROM claims`
        );

        res.status(200).json({
            users: {
                total: Number(usersResult.rows[0].count)
            },

            items: {
                total: Number(itemsResult.rows[0].total),
                lost: Number(itemsResult.rows[0].lost),
                found: Number(itemsResult.rows[0].found),
                open: Number(itemsResult.rows[0].open),
                claimed: Number(itemsResult.rows[0].claimed)
            },

            claims: {
                total: Number(claimsResult.rows[0].total),
                pending: Number(claimsResult.rows[0].pending),
                approved: Number(claimsResult.rows[0].approved),
                rejected: Number(claimsResult.rows[0].rejected)
            }
        });

    } catch (error) {
        console.log("Dashboard stats error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getDashboardStats
};