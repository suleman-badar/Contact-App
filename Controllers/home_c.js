const Contact = require("../models/contact.js");
const { storage } = require("../cloudinaryConfig");
const multer = require("multer");
const upload = multer({ storage });


module.exports.getHomePage = async(req, res) => {
    const user = req.user;
    const userId = user._id;

    const allContacts = await Contact.find({ userId });
    res.render("home", {
        allContacts,
        userId,
        userPhoto: user.photo,
        addToFolder: false,
        viewingFolder: false

    });
}

module.exports.addContacts_get = (req, res) => {
    res.render("add-contact.ejs", { addToFolder: false, viewingFolder: false });
}


module.exports.addContacts_post = async(req, res) => {



    const { name, number, email, photo, address, bday, relation, gender, city, country } = req.body;

    let photoPath = req.file ? req.file.path : '';

    let newContact = new Contact({
        name,
        number,
        email,
        photo: photoPath,
        address,
        bday,
        relation,
        gender,
        city,
        country,
        userId: req.user._id,
        folderId: req.body.folderId
    });
    await newContact.save();
    req.flash("success", "New Contact Added");
    res.redirect('/home');

}





module.exports.contactInfo = async(req, res) => {
    res.render("info.ejs", { contact: req.contact, addToFolder: false });
};



module.exports.editContacts_get = async(req, res) => {
    res.render("edit.ejs", { contact: req.contact, addToFolder: false });
};
module.exports.editContacts_put = async(req, res) => {
    const {
        name,
        number,
        email,
        address,
        bday,
        relation,
        gender,
        city,
        country
    } = req.body;

    const photoPath = req.file ? req.file.path : req.contact.photo;

    await Contact.findByIdAndUpdate(req.contact._id, {
        name,
        number,
        email,
        photo: photoPath,
        address,
        bday,
        relation,
        gender,
        city,
        country
    });

    req.flash("success", "Contact Edited");
    res.redirect("/home");
};



module.exports.deleteContact = async(req, res) => {
    await Contact.findByIdAndDelete(req.contact._id);
    req.flash("success", "Contact Deleted");
    res.redirect("/home");
};




module.exports.deleteMultipleContacts = async(req, res) => {

    let { contactIds } = req.body;


    // Ensure it's always an array
    if (!Array.isArray(contactIds)) {
        contactIds = [contactIds];
    }



    if (!contactIds || contactIds.length === 0) {
        req.flash("error", "No contacts selected.");
        return res.redirect("/home");
    }

    await Contact.deleteMany({
        _id: { $in: contactIds },
        userId: req.user._id
    });

    req.flash("success", " Contacts Deleted");

    res.redirect("/home");
}


module.exports.searchQuery = async(req, res) => {

    let { search } = req.query;
    const user = req.user; // ✅ get current logged-in user

    const filter = { userId: user._id };

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { number: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const contacts = await Contact.find(filter);

    res.render("home", {
        allContacts: contacts,
        userId: user._id,
        userPhoto: user.photo,
        searchTerm: search || "",
        addToFolder: false,
        viewingFolder: false
    });
}