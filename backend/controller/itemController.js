const pool = require("../config/db");

const createItem = async (req, res) => {
    try {
        const { title, description, type, location, date } = req.body;

        const user_id = req.user.id;

        const result = await pool.query(
            `INSERT INTO items 
            (title, description, type, location, date, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [title, description, type, location, date, user_id]
        );

        res.status(201).json({
            message: "Item created successfully",
            item: result.rows[0]
        });

    } catch (error) {
        console.log("Create item error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getallitems = async (req, res) => {
    try {
        const { type, search } = req.query;
        let query = `
    SELECT
        items.*,
        users.name AS user_name,
        users.email AS user_email
    FROM items
    JOIN users ON items.user_id = users.id
    WHERE 1=1
`;

        
        const values = [];
        if (type) {
            values.push(type);
            query += ` AND type = $${values.length}`;
        }
        if (search) {
            values.push(`%${search}%`);
            query += ` AND (title ILIKE $${values.length} OR location ILIKE $${values.length})`;
        }

        query += " ORDER BY created_at DESC";

        const result = await pool.query(query, values);

        res.status(200).json({
            items: result.rows
        });

    } catch (error) {
        console.log("Get items error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getItemById = async (req, res) => {
    try {

        const { id } = req.params;
const result = await pool.query(
    `SELECT
        items.*,
        users.name AS user_name,
        users.email AS user_email
     FROM items
     JOIN users ON items.user_id = users.id
     WHERE items.id = $1`,
    [id]
);
       
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        res.status(200).json({
            item: result.rows[0]
        });

    } catch (error) {

        console.log("Get item error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;

        const { title, description, type, location, date, status } = req.body;

        const itemResult = await pool.query(
            "SELECT * FROM items WHERE id = $1",
            [id]
        );

        if (itemResult.rows.length === 0) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        const item = itemResult.rows[0];

        if (item.user_id !== req.user.id) {
            return res.status(403).json({
                message: "You can update only your own item"
            });
        }

        const result = await pool.query(
            `UPDATE items
             SET title = $1,
                 description = $2,
                 type = $3,
                 location = $4,
                 date = $5,
                 status = $6
             WHERE id = $7
             RETURNING *`,
            [title, description, type, location, date, status, id]
        );

        res.status(200).json({
            message: "Item updated successfully",
            item: result.rows[0]
        });

    } catch (error) {
        console.log("Update item error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

      
        const itemResult = await pool.query(
            "SELECT * FROM items WHERE id = $1",
            [id]
        );

        if (itemResult.rows.length === 0) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        const item = itemResult.rows[0];

        if (Number(item.user_id) !== Number(req.user.id)) {
            return res.status(403).json({
                message: "You can delete only your own item"
            });
        }

        const result = await pool.query(
            "DELETE FROM items WHERE id = $1 RETURNING *",
            [id]
        );

        res.status(200).json({
            message: "Item deleted successfully",
            item: result.rows[0]
        });

    } catch (error) {
        console.log("Delete item error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getMyItems = async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await pool.query(
            `SELECT * FROM items
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [user_id]
        );

        res.status(200).json({
            items: result.rows
        });

    } catch (error) {
        console.log("Get my items error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
module.exports = { createItem,getallitems , getItemById,getMyItems,updateItem,deleteItem };