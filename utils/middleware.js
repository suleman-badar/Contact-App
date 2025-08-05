function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash("error", "Login Required");
        return res.redirect("/login");
    }
    next();
}

module.exports = { isLoggedIn };