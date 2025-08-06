const User = require("../models/user.js");
const passport = require("passport");


//get login page
module.exports.getLogin = (req, res) => {
    res.render("login", {
        email: "",
        emailError: null,
        passwordError: null,
        generalError: null
    });
}

//checking user credentials to let them login

module.exports.checkingUser = async(req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        req.flash("error", "Invalid email.");
        return res.redirect("/login");

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
            if (err) return next(err);

            const redirectUrl = res.locals.redirectUrl || "/home";
            res.redirect(redirectUrl);
        });

    })(req, res, next);
};


//logging out user
module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next();
        }
        req.flash("success", "You are logged out. Try logging in again");
        res.redirect("/login");
    })
}