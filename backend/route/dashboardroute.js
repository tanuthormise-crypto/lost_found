const express = require("express");

const {
    getDashboardStats
} = require("../controller/dashboardController");

const authenticateuser = require("../middleware/authMiddleware");
const roleadmin = require("../middleware/rolemiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateuser,
    roleadmin,
    getDashboardStats
);

module.exports = router;