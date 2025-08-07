const express = require("express");
const router = express.Router();
const { saveRedirectUrl } = require("../utils/middleware.js");
const loginController = require("../Controllers/login_c.js");


//login Routes
router.route("/")
    .get(loginController.getLogin)
    .post(saveRedirectUrl, loginController.checkingUser);



//logging out user
router.get("/logout", loginController.logoutUser);


module.exports = router;