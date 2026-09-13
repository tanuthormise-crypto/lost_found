const cors = require("cors");
const express = require("express");

const pool = require("./config/db");
const userroute = require("./route/userroute");
const dashboardroute = require("./route/dashboardroute");
const authroute = require("./route/authroute");
const itemroute = require("./route/itemroute");

const app = express();
app.use(cors());
const claimroute = require("./route/claimroute");
const PORT = 5000;
app.use(express.json());
app.use("/api/auth", authroute);
app.use("/api/items", itemroute);
app.use("/api/claims", claimroute);
app.use("/api/users", userroute);
app.use("/api/dashboard", dashboardroute);
app.get("/", (req, res) => {
    res.send("Lost & Found Backend is running!");
});

pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Database connected successfully!");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});