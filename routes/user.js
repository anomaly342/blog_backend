const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/loggedin", userController.loggedin_get);
router.get("/logout", userController.logout_get);

router.post("/signup", userController.addUser_post);
router.post("/login", userController.login_post);

module.exports = router;
