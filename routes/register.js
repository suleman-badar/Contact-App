const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { storage } = require("../cloudinaryConfig.js");
const wrapAsync = require("../utils/wrapAsync.js");


const multer = require("multer");

const upload = multer({ storage });

router.get("/", (req, res) => {
    const { name = '', email = '', dob = '' } = req.session.formData || {};
    req.session.formData = null;

    res.render("register", {
        name,
        email,
        dob,
        error: null
    });
});


//sending login details to database
router.post("/", upload.single("photo"), wrapAsync(async(req, res) => {
    const { name, email, password, dob, confirmPass } = req.body;

    req.session.formData = { name, email, dob };

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).render("register", {
            name,
            email,
            dob,
            error: "A user with this email already exists.",
        });
    }
    if (new Date(dob) > new Date()) {
        return res.status(400).render("register", {
            name,
            email,
            dob,
            error: "Date of birth cannot be in the future."
        });

    }

    if (password !== confirmPass) {
        return res.status(400).render("register", {
            name,
            email,
            dob,
            error: "Passwords do not match.",
        });
    }



    const photoPath = req.file ? req.file.path : "";

    const user = new User({
        name,
        photo: photoPath,
        email,
        dob // 👈 Store DOB
    });

    try {
        const reg = await User.register(user, password);
        req.login(reg, (err) => {
            if (err) {
                return next(err);
            }
            req.session.formData = null;
            req.flash("success", "User Registered Successfully");
            return res.redirect("/home");
        })
    } catch (err) {
        req.flash("error", "Some error occured. Please try again")
        return res.render("register", {
            name,
            email,
            dob,
        });
    }
}));
module.exports = router;