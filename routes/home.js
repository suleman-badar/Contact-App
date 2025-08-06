const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../utils/middleware.js");
const { verifyContactOwnership } = require("../utils/middleware.js");

const { storage } = require("../cloudinaryConfig");
const multer = require("multer");
const upload = multer({ storage });

const homeController = require("../Controllers/home_c.js");


//home page
router.get("/", isLoggedIn, wrapAsync(homeController.getHomePage));



// to get contact form

router.get("/add-contact", isLoggedIn, homeController.addContacts_get);



//adding form data to dataBase
router.post("/add-contact", isLoggedIn, upload.single('photo'), wrapAsync(homeController.addContacts_post));


//Individual data fetching
router.get("/info/:id", isLoggedIn, verifyContactOwnership, wrapAsync(homeController.contactInfo));


//rendering to edit page of individual contact
router.get("/edit/:id", isLoggedIn, verifyContactOwnership, wrapAsync(homeController.editContacts_get));


//put request for edited data
router.put("/edit/:id", isLoggedIn, upload.single("photo"), verifyContactOwnership, wrapAsync(homeController.editContacts_put));


//delete contact 
router.delete("/delete/:id", isLoggedIn, verifyContactOwnership, wrapAsync(homeController.deleteContact));


//delete multiple
router.delete("/delete-multiple", isLoggedIn, wrapAsync(homeController.deleteMultipleContacts));


//search Query
router.get("/search", isLoggedIn, wrapAsync(homeController.searchQuery));



module.exports = router;