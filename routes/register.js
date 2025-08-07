const express = require("express");
const router = express.Router();
const { storage } = require("../cloudinaryConfig.js");
const wrapAsync = require("../utils/wrapAsync.js");
const registerController = require("../Controllers/register_c.js");
const multer = require("multer");
const upload = multer({ storage });


//Register Page routes
router.route("/")
    .get(registerController.getRegister) //getting register form
    .post(upload.single("photo"), wrapAsync(registerController.registeringUser)); //sending login details to database

module.exports = router;