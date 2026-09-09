const express = require("express");
const { registeruser,loginuser } = require("../controller/authController");
const authenticateuser=require("../middleware/authMiddleware");
const roleadmin=require("../middleware/rolemiddleware");
const router = express.Router();

router.post("/register", registeruser);
router.post("/login", loginuser);
router.get("/profile",authenticateuser,(req,res)=>{
    res.json({
        message:"only authorised can acess",
        user:req.user
    });
});
router.get("/admin-test",authenticateuser,roleadmin,(req,res)=>{
    res.status(200).json({
        message:"welcome admin"
    });

});
module.exports = router;