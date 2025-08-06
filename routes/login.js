const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../utils/middleware.js");

router.get("/", (req, res) => {
    res.render("login", {
        email: "",
        emailError: null,
        passwordError: null,
        generalError: null
    });
});


//checking user credentials to let them login
router.post("/", saveRedirectUrl, async(req, res, next) => {
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
            res.redirect(res.locals.redirectUrl);
        });
    })(req, res, next);
});

//logging out user
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next();
        }
        req.flash("success", "You are loggged out. Try logging in again");
        res.redirect("/login");
    })
});


module.exports = router;