const express = require("express");
const router = express.Router();
const { storage } = require("../cloudinaryConfig.js");
const wrapAsync = require("../utils/wrapAsync.js");
const registerController = require("../Controllers/register_c.js");


const multer = require("multer");

const upload = multer({ storage });


//getting register form
router.get("/", registerController.getRegister);


//sending login details to database
router.post("/", upload.single("photo"), wrapAsync(registerController.registeringUser));


module.exports = router;