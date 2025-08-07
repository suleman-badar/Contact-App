const Contact = require("../models/contact.js");
const Folder = require("../models/folder.js");


//to get folders
module.exports.folder_get = async(req, res) => {
    const user = req.user;
    const allFolders = await Folder.find({ userId: user._id });
    res.render("folder.ejs", {
        allFolders,
        userId: user._id,
        userPhoto: user.photo,
        addToFolder: false
    });
}

//to create new folders
module.exports.newFolder = async(req, res) => {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name) return res.status(400).send("Missing folder name");

    const newFolder = new Folder({ name, userId });
    await newFolder.save();
    res.redirect("/folders");
}

//to delete folders
module.exports.deleteFolder = async(req, res) => {
    const folderId = req.params.folderId;
    await Folder.findByIdAndDelete(folderId);
    res.redirect("/folders");
}

//to get home page on clicking to add contacts in folders page
module.exports.addingContacts_get = async(req, res) => {
    const folderId = req.params.folderId;
    const user = req.user;
    const folder = await Folder.findById(folderId).populate("contacts");

    const allContacts = await Contact.find({
        userId: user._id,
        _id: { $nin: folder.contacts.map(c => c._id) } // Exclude already added contacts
    });
    res.render("home", {
        allContacts,
        userId: user._id,
        userPhoto: user.photo,
        addToFolder: true,
        folderId,
        viewingFolder: false
    });
}

// Add selected contacts to a folder
module.exports.addingContacts_post = async(req, res) => {
    const folderId = req.params.folderId;
    const contactIds = req.body.contactIds;

    if (!folderId || !contactIds) {
        return res.status(400).send("Missing folderId or contactIds");
    }

    await Folder.findByIdAndUpdate(folderId, {
        $addToSet: { contacts: { $each: Array.isArray(contactIds) ? contactIds : [contactIds] } }
    });

    res.redirect("/folders");
}


// View contacts inside a specific folder
module.exports.viewContacts = async(req, res) => {
    const folderId = req.params.folderId;
    const folder = await Folder.findById(folderId).populate("contacts");
    const user = req.user;

    res.render("home.ejs", {
        allContacts: folder.contacts,
        userId: user._id,
        userPhoto: user.photo,
        addToFolder: false,
        folderId: folderId,
        viewingFolder: true
    });
}


// Remove a contact from a specific folder
module.exports.removeContactFromFolder = async(req, res) => {
    const { folderId, contactId } = req.params;

    await Folder.findByIdAndUpdate(folderId, {
        $pull: { contacts: contactId }
    });

    req.flash("success", "Contact removed from folder.");
    res.redirect(`/folders/${folderId}/view`);
};



//remove multiple from a folder
module.exports.removeMultipleFromFolder = async(req, res) => {
    const { folderId } = req.params;
    const { contactIds } = req.body;

    if (!contactIds || contactIds.length === 0) {
        req.flash("error", "No contacts selected.");
        return res.redirect(`/folders/${folderId}/view`);
    }

    const idsToRemove = Array.isArray(contactIds) ? contactIds : [contactIds];

    await Folder.findByIdAndUpdate(folderId, {
        $pull: { contacts: { $in: idsToRemove } }
    });

    req.flash("success", "Selected contacts removed from the folder.");
    res.redirect(`/folders/${folderId}/view`);
};