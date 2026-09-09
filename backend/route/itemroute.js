const express = require("express");

const { createItem, getallitems,getItemById ,updateItem,deleteItem,getMyItems} = require("../controller/itemController");
const authenticateuser = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/", authenticateuser, createItem);
router.get("/",getallitems);
router.get("/my-items", authenticateuser, getMyItems);
router.get("/:id", getItemById);
router.put("/:id", authenticateuser, updateItem);
router.delete("/:id", authenticateuser, deleteItem);

module.exports = router;