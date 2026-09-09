const express = require("express");

const {
    createClaim,
    getAllClaims,getMyClaims,
    updateClaimStatus
} = require("../controller/claimController");

const authenticateuser = require("../middleware/authMiddleware");
const roleadmin = require("../middleware/rolemiddleware");

const router = express.Router();


router.post("/", authenticateuser, createClaim);

router.get("/my-claims", authenticateuser, getMyClaims);

router.get("/", authenticateuser, roleadmin, getAllClaims);


router.put("/:id", authenticateuser, roleadmin, updateClaimStatus);


module.exports = router;