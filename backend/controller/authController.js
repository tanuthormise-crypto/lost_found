const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registeruser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "name ,email,password are required"
            });
        }
        const existinguser = await pool.query("select * from users where email=$1", [email]);
        if (existinguser.length > 0) {
            return res.status(409).json({
                message: "email already register"
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(`insert into users(name,email,password,phone) values($1,$2,$3,$4) returning id,name,email,phone,role,status,created_at`, [name, email, hashPassword, phone]);
        res.status(201).json({
            message: "user registered successfully",
            user: result.rows[0]
        });
    }
    catch (error) {
        console.error("registratuion error", error);
        res.status(500).json({ message: "server error" });
    }
};
const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "both email and password required !"
            });
        }
        const result = await pool.query("select * from users where email=$1", [email]);
        if (result.rows.length == 0) {
            return res.status(401).json({
                message: "invalid email or password"
            });
        }
        const user = result.rows[0];
        const ispasswordcorr = await bcrypt.compare(password, user.password);
        if (!ispasswordcorr) {
            return res.status(401).json({
                message: "invalid password !"
            });
        }
        const token = jwt.sign({
            id: user.id,
            role: user.role
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );
        res.status(200).json({

            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {
        console.error("login error", error);
        return res.status(404).json({
            message: "not found"
        });
    }

};
module.exports = { registeruser ,loginuser};