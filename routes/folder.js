const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../utils/middleware.js");
const folderController = require("../Controllers/folder_c.js")


//to get folders
router.get("/", isLoggedIn, wrapAsync(folderController.folder_get));


//to create new folders
router.post("/create", isLoggedIn, wrapAsync(folderController.newFolder));


//to delete folders
router.delete("/delete/:folderId", isLoggedIn, wrapAsync(folderController.deleteFolder));


//to get home page on clicking to add contacts in folders page
router.get("/add-contacts/:folderId", isLoggedIn, wrapAsync(folderController.addingContacts_get));


// Add selected contacts to a folder
router.post("/add-to-folder/:folderId", isLoggedIn, wrapAsync(folderController.addingContacts_post));


// View contacts inside a specific folder
router.get("/:folderId", isLoggedIn, wrapAsync(folderController.viewContacts));

module.exports = router;