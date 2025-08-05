const express = require("express");
const router = express.Router();
const Contact = require("../models/contact.js");
const User = require("../models/user.js");
const Folder = require("../models/folder.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../utils/middleware.js");





//to get folders
router.get("/", isLoggedIn, wrapAsync(async(req, res) => {
    const user = req.user;
    const allFolders = await Folder.find({ userId: user._id });
    res.render("folder.ejs", {
        allFolders,
        userId: user._id,
        userPhoto: user.photo,
        addToFolder: false
    });
}));


//to create new folders
router.post("/create", isLoggedIn, wrapAsync(async(req, res) => {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name) return res.status(400).send("Missing folder name");

    const newFolder = new Folder({ name, userId });
    await newFolder.save();
    res.redirect("/folders");
}));





//to delete folders
router.delete("/delete/:folderId", isLoggedIn, wrapAsync(async(req, res) => {
    const folderId = req.params.folderId;
    await Folder.findByIdAndDelete(folderId);
    res.redirect("/folders");
}));

//to get home page on clicking to add contacts in folders page
router.get("/add-contacts/:folderId", isLoggedIn, wrapAsync(async(req, res) => {
    const folderId = req.params.folderId;
    const user = req.user;
    const allContacts = await Contact.find({ userId: user._id });

    res.render("home", {
        allContacts,
        userId: user._id,
        userPhoto: user.photo,
        addToFolder: true,
        folderId
    });
}));




// Add selected contacts to a folder
router.post("/add-to-folder/:folderId", isLoggedIn, wrapAsync(async(req, res) => {
    const folderId = req.params.folderId;
    const contactIds = req.body.contactIds;

    if (!folderId || !contactIds) {
        return res.status(400).send("Missing folderId or contactIds");
    }

    await Folder.findByIdAndUpdate(folderId, {
        $addToSet: { contacts: { $each: Array.isArray(contactIds) ? contactIds : [contactIds] } }
    });

    res.redirect("/folders");
}));


// View contacts inside a specific folder
router.get("/:folderId", isLoggedIn, wrapAsync(async(req, res) => {
    const folderId = req.params.folderId;
    const folder = await Folder.findById(folderId).populate("contacts");
    const user = req.user;

    res.render("home.ejs", {
        allContacts: folder.contacts,
        userId: user._id,
        userPhoto: user.photo,
        addToFolder: false
    });
}));
module.exports = router;