const express = require("express");
const router = express.Router();
const { saveRedirectUrl } = require("../utils/middleware.js");
const loginController = require("../Controllers/login_c.js");

//get login page
router.get("/", loginController.getLogin);


//checking user credentials to let them login
router.post("/", saveRedirectUrl, loginController.checkingUser);

//logging out user
router.get("/logout", loginController.logoutUser);


module.exports = router;