const pool = require("../config/db");

const createClaim = async (req, res) => {
    try {
        const { item_id, message } = req.body;

        const user_id = req.user.id;

        const itemResult = await pool.query(
            "SELECT * FROM items WHERE id = $1",
            [item_id]
        );

        if (itemResult.rows.length === 0) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        const item = itemResult.rows[0];

        if (item.status !== "open") {
            return res.status(400).json({
                message: "This item is already claimed"
            });
        }

        if (Number(item.user_id) === Number(user_id)) {
            return res.status(403).json({
                message: "You cannot claim your own item"
            });
        }

        const result = await pool.query(
            `INSERT INTO claims
            (item_id, user_id, message)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [item_id, user_id, message]
        );

        res.status(201).json({
            message: "Claim submitted successfully",
            claim: result.rows[0]
        });

    } catch (error) {
        console.log("Create claim error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getAllClaims = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                claims.id,
                claims.item_id,
                claims.user_id,
                claims.message,
                claims.status,
                claims.created_at,
                items.title AS item_title,
                users.name AS user_name,
                users.email AS user_email
             FROM claims
             JOIN items ON claims.item_id = items.id
             JOIN users ON claims.user_id = users.id
             ORDER BY claims.created_at DESC`
        );

        res.status(200).json({
            claims: result.rows
        });

    } catch (error) {
        console.log("Get all claims error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const updateClaimStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (status !== "approved" && status !== "rejected") {
            return res.status(400).json({
                message: "Status must be approved or rejected"
            });
        }

        const claimResult = await pool.query(
            "SELECT * FROM claims WHERE id = $1",
            [id]
        );

        if (claimResult.rows.length === 0) {
            return res.status(404).json({
                message: "Claim not found"
            });
        }

        const claim = claimResult.rows[0];

        const result = await pool.query(
            `UPDATE claims
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );
        if (status === "approved") {
            await pool.query(
                `UPDATE items
                 SET status = 'claimed'
                 WHERE id = $1`,
                [claim.item_id]
            );
        }

        res.status(200).json({
            message: `Claim ${status} successfully`,
            claim: result.rows[0]
        });

    } catch (error) {
        console.log("Update claim status error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getMyClaims = async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await pool.query(
            `SELECT 
                claims.id,
                claims.item_id,
                claims.message,
                claims.status,
                claims.created_at,
                items.title AS item_title,
                items.description AS item_description,
                items.location AS item_location,
                items.type AS item_type
             FROM claims
             JOIN items ON claims.item_id = items.id
             WHERE claims.user_id = $1
             ORDER BY claims.created_at DESC`,
            [user_id]
        );

        res.status(200).json({
            claims: result.rows
        });

    } catch (error) {
        console.log("Get my claims error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
module.exports = {
    createClaim,getAllClaims,getMyClaims,updateClaimStatus
};