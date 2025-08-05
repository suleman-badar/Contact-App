    const express = require("express");
    const router = express.Router();
    const User = require("../models/user.js");
    const { isLoggedIn } = require("../utils/middleware.js");
    const wrapAsync = require("../utils/wrapAsync.js");

    const { storage } = require("../cloudinaryConfig");
    const multer = require("multer");
    const upload = multer({ storage });



    //rendering to profile of user
    router.get("/", isLoggedIn, wrapAsync(async(req, res) => {
        const user = await User.findById(req.user._id); // Passport attaches the user to req.user

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/login");
        }

        res.render("profile.ejs", { user, addToFolder: false });
    }));

    //rendering to edit profile page
    router.get('/edit', isLoggedIn, (req, res) => {
        res.render('editProfile', { user: req.user, addToFolder: false });
    });


    //edit req for profile
    router.post("/edit", isLoggedIn, upload.single("photo"), wrapAsync(async(req, res, next) => {
        const { name, email, currentPassword } = req.body || {};
        const user = await User.findById(req.user._id);
        user.name = name;

        if (req.file) {
            user.photo = req.file.path;
        }

        let emailChanged = false;

        if (email && email !== user.email) {
            if (!currentPassword || currentPassword.length === 0) {
                req.flash("error", "Password is required to change your email.");
                return res.redirect("/profile/edit");
            }

            const isValid = await user.authenticate(currentPassword);
            if (!isValid.user) {
                req.flash("error", "Incorrect password. Email not changed.");
                return res.redirect("/profile/edit");
            }

            const existing = await User.findOne({ email });
            if (existing && existing._id.toString() !== user._id.toString()) {
                req.flash("error", "This email is already taken.");
                return res.redirect("/profile/edit");
            }

            user.email = email;
            emailChanged = true;
        }

        await user.save();

        if (emailChanged) {
            // ✅ Re-login the user so session gets updated
            req.login(user, function(err) {
                if (err) {
                    req.flash("error", "Something went wrong while updating session.");
                    return res.redirect("/login");
                }
                req.flash("success", "Profile and email updated successfully.");
                return res.redirect("/profile");
            });
        } else {
            req.flash("success", "Profile updated successfully.");
            res.redirect("/profile");
        }
    }));



    //changing user password,Get request
    router.get('/change-password', isLoggedIn, (req, res) => {
        res.render('changePass', { addToFolder: false });
    });



    //changing Password
    router.post('/change-password', isLoggedIn, wrapAsync(async(req, res) => {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            req.flash("error", "New passwords do not match.");
            return res.redirect("/profile/change-password");
        }

        const user = await User.findById(req.user._id);

        user.changePassword(oldPassword, newPassword, async function(err) {
            if (err) {
                console.error("❌ Error changing password:", err);
                req.flash("error", "Incorrect current password.");
                return res.redirect("/profile/change-password");
            }

            // Re-login the user with the new password
            req.login(user, (err) => {
                if (err) {
                    console.error("❌ Error re-logging in:", err);
                    req.flash("error", "Password changed, but login failed.");
                    return res.redirect("/login");
                }

                req.flash("success", "Password changed successfully.");
                res.redirect("/profile");
            });
        });
    }));



    module.exports = router;