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

    // console.log("👉 User found, calling passport.authenticate...");

    passport.authenticate("local", (err, authenticatedUser, info) => {
        // console.log("🧠 passport.authenticate callback executed");

        if (err) {
            console.error("❌ Passport error:", err);
            return next(err);
        }

        if (!authenticatedUser) {
            console.warn("❌ Authentication failed:", info);
            return res.render("login", {
                email,
                emailError: null,
                passwordError: "❌ Incorrect password.",
                generalError: null
            });
        }

        req.logIn(authenticatedUser, (err) => {
            if (err) {
                console.error("❌ req.logIn failed:", err);
                return next(err);
            }
            // console.log("✅ Logged in:", authenticatedUser.email);
            res.redirect("/home");
        });
    })(req, res, next);
});



module.exports = router;