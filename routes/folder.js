const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, verifyFolderOwnership } = require("../utils/middleware.js");
const folderController = require("../Controllers/folder_c.js");


router.use(isLoggedIn);


// Folder main routes
router.route("/")
    .get(wrapAsync(folderController.folder_get))
    .post(wrapAsync(folderController.newFolder));




// Folder contact management routes


//to View contacts inside a folder
router.get("/:folderId/view", verifyFolderOwnership, wrapAsync(folderController.viewContacts));


router.route("/:folderId")
    .get(verifyFolderOwnership,
        wrapAsync(folderController.addingContacts_get)) //get page to add contacts to a folder
    .post(verifyFolderOwnership,
        wrapAsync(folderController.addingContacts_post)) //add contacst to a specific folder
    .delete(verifyFolderOwnership,
        wrapAsync(folderController.deleteFolder)); //delete a folder

// Remove a contact from a folder
router.delete("/:folderId/remove/:contactId", verifyFolderOwnership, wrapAsync(folderController.removeContactFromFolder));


//remove multiple contacst from a folder
router.delete("/:folderId/remove-multiple", verifyFolderOwnership, wrapAsync(folderController.removeMultipleFromFolder));

module.exports = router;