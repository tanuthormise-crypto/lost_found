const express = require("express");

const { getAllUsers ,updateUserStatus} = require("../controller/userController");

const authenticateuser = require("../middleware/authMiddleware");
const roleadmin = require("../middleware/rolemiddleware");

const router = express.Router();

router.get("/", authenticateuser, roleadmin, getAllUsers);
router.put("/:id/status", authenticateuser, roleadmin, updateUserStatus);
module.exports = router;