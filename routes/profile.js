const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../utils/middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { storage } = require("../cloudinaryConfig");
const multer = require("multer");
const upload = multer({ storage });
const profileController = require("../Controllers/profile_c.js");


router.use(isLoggedIn);


//rendering to profile of user
router.get("/", wrapAsync(profileController.getProfile));


//Profile Editing routes
router.route("/edit")
    .get(profileController.editProfile_get)
    .post(upload.single("photo"),
        wrapAsync(profileController.editProfile_post));

//Chnaging password routes
router.route("/change-password")
    .get(profileController.changePass_get)
    .post(wrapAsync(profileController.changePass_post));


module.exports = router;