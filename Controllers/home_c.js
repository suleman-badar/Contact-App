const Contact = require("../models/contact.js");


module.exports.home = async(req, res) => {
    const user = req.user;
    const userId = user._id;

    const allContacts = await Contact.find({ userId });
    res.render("home", {
        allContacts,
        userId,
        userPhoto: user.photo,
        addToFolder: false
    });
}