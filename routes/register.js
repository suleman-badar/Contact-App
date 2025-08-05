const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { storage } = require("../cloudinaryConfig");
const wrapAsync = require("../utils/wrapAsync.js");


const multer = require("multer");

const upload = multer({ storage });

router.get("/", (req, res) => {
    const { name = '', email = '' } = req.session.formData || {};
    req.session.formData = null;

    res.render("register", {
        name,
        email
    });
});

//sending login details to database
router.post("/", upload.single("photo"), wrapAsync(async(req, res) => {
    const { name, email, password } = req.body;

    req.session.formData = { name, email };
    // if (!name || name.trim() === "") {
    //     req.flash("error", "⚠ Name is required.");
    //     return res.redirect("/register");
    // }

    // if (password.length < 8) {
    //     req.flash("error", "Password must be at least 8 characters long.");
    //     return res.redirect("/register");
    // }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).render("register", {
            name,
            email,
            error: "A user with this email already exists.",
        });
    }
    const photoPath = req.file ? req.file.path : "";

    const user = new User({
        name,
        photo: photoPath,
        email,
    });

    try {
        const reg = await User.register(user, password);
        req.session.formData = null;
        req.flash("success", "User Registered Successfully");
        return res.redirect("/login");
    } catch (err) {
        return res.status(400).render("register", {
            name,
            email,
            error: err.message,
        });
    }

}));

module.exports = router;