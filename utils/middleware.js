const Contact = require("../models/contact");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login Required");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.verifyContactOwnership = async(req, res, next) => {
    const contact = await Contact.findOne({
        _id: req.params.id,
        userId: req.user._id
    });

    if (!contact) {
        req.flash("error", "Contact not found or unauthorized access.");
        return res.redirect("/home");
    }

    // Attach contact to request so controller doesn't have to query again
    req.contact = contact;
    next();
};