const express = require("express");
const router = express.Router();
const Contact = require("../models/contact.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../utils/middleware.js");

const { storage } = require("../cloudinaryConfig");

const multer = require("multer");

const upload = multer({ storage });


//home page
router.get("/", isLoggedIn, wrapAsync(async(req, res) => {


    const user = req.user;
    const userId = user._id;

    const allContacts = await Contact.find({ userId });
    res.render("home", {
        allContacts,
        userId,
        userPhoto: user.photo,
        addToFolder: false
    });
}));



// to get contact form

router.get("/add-contact", isLoggedIn, (req, res) => {
    res.render("add-contact.ejs", { addToFolder: false });
});



//adding form data to dataBase
router.post("/add-contact", isLoggedIn, upload.single('photo'), wrapAsync(async(req, res) => {



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

}));



//rendering to edit page of individual contact
router.get("/edit/:id", isLoggedIn, wrapAsync(async(req, res) => {

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        req.flash("error", "Contact doesnot exist");
        return res.redirect("/home");
    };
    res.render("edit.ejs", { contact, addToFolder: false });

}));






//Individual data fetching
router.get("/info/:id", isLoggedIn, wrapAsync(async(req, res) => {

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        req.flash("error", "Contact doesnot exist");
        res.redirect("/home");
    };
    res.render("info.ejs", { contact, addToFolder: false });

}));


//put request for edited data
router.put("/edit/:id", isLoggedIn, upload.single("photo"), wrapAsync(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    const {
        name,
        number,
        email,
        photo,
        address,
        bday,
        relation,
        gender,
        city,
        country
    } = req.body;
    let photoPath = req.file ? req.file.path : contact.photo;

    await Contact.findByIdAndUpdate(req.params.id, {
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
    if (!contact) {
        req.flash("error", "Contact doesnot exist");
        res.redirect("/home");
    };
    req.flash("success", " Contact Edited");

    res.redirect("/home");

}));

//delete contact 
router.delete("/delete/:id", isLoggedIn, wrapAsync(async(req, res) => {

    // console.log("Deleteting", req.params.id);
    await Contact.findByIdAndDelete(req.params.id);
    req.flash("success", " Contact Deleted");
    res.redirect("/home");

}));


//delete multiple
router.delete("/delete-multiple", isLoggedIn, wrapAsync(async(req, res) => {

    let { contactIds } = req.body;

    // Ensure it's always an array
    if (!Array.isArray(contactIds)) {
        contactIds = [contactIds];
    }

    if (contactIds.length > 0) {
        await Contact.deleteMany({ _id: { $in: contactIds } });
    }
    req.flash("success", " Contacts Deleted");

    res.redirect("/home");
}));




router.get("/search", isLoggedIn, wrapAsync(async(req, res) => {

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
        addToFolder: false
    });
}));





module.exports = router;