const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../utils/middleware.js");
const { verifyContactOwnership } = require("../utils/middleware.js");
const { storage } = require("../cloudinaryConfig");
const multer = require("multer");
const upload = multer({ storage });
const homeController = require("../Controllers/home_c.js");

router.use(isLoggedIn);


//home page
router.get("/", wrapAsync(homeController.getHomePage));



//Add-contact Route
router.route("/add-contact")
    .get(homeController.addContacts_get)
    .post(upload.single('photo'),
        wrapAsync(homeController.addContacts_post)
    );


//Individual data fetching
router.get("/info/:id", verifyContactOwnership, wrapAsync(homeController.contactInfo));


// Contact edit routes (individual)
router.route("/contact/:id/edit")
    .get(verifyContactOwnership,
        wrapAsync(homeController.editContacts_get))
    .put(upload.single("photo"),
        verifyContactOwnership,
        wrapAsync(homeController.editContacts_put))
    .delete(verifyContactOwnership,
        wrapAsync(homeController.deleteContact)
    );




// Bulk delete route (for multiple contacts)
router.delete("/delete-multiple", wrapAsync(homeController.deleteMultipleContacts));


//search Query
router.get("/search", wrapAsync(homeController.searchQuery));



module.exports = router;