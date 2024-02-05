const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/registration", userController.addUser_post);
router.post("/login", userController.login_post);

module.exports = router;
