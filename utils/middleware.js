const Contact = require("../models/contact");
const Folder = require("../models/folder.js");


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

module.exports.verifyFolderOwnership = async(req, res, next) => {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    if (!folder || !folder.userId.equals(req.user._id)) {
        req.flash("error", "You do not have permission to access this folder.");
        return res.redirect("/folders");
    }
    next();
};