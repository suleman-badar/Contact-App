const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../utils/middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { storage } = require("../cloudinaryConfig");
const multer = require("multer");
const upload = multer({ storage });
const profileController = require("../Controllers/profile_c.js");


//rendering to profile of user
router.get("/", isLoggedIn, wrapAsync(profileController.getProfile));

//rendering to edit profile page
router.get('/edit', isLoggedIn, profileController.editProfile_get);


//edit req for profile
router.post("/edit", isLoggedIn, upload.single("photo"), wrapAsync(profileController.editProfile_post));



//changing user password,Get request
router.get('/change-password', isLoggedIn, profileController.changePass_get);



//changing Password
router.post('/change-password', isLoggedIn, wrapAsync(profileController.changePass_post));




module.exports = router;