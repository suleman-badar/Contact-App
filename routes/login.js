const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");




router.get("/", (req, res) => {
    res.render("login", {
        email: "",
        emailError: null,
        passwordError: null,
        generalError: null
    });
});


//checking user credentials to let them login
router.post("/", async(req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.render("login", {
            email,
            emailError: "❌ Invalid email",
            passwordError: null,
            generalError: null
        });
    }


    passport.authenticate("local", (err, authenticatedUser, info) => {

        if (err) {
            console.error("❌ Passport error:", err);
            return next(err);
        }

        if (!authenticatedUser) {
            return res.render("login", {
                email,
                emailError: null,
                passwordError: "❌ Incorrect password.",
                generalError: null
            });
        }

        req.logIn(authenticatedUser, (err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/home");
        });
    })(req, res, next);
});



module.exports = router;