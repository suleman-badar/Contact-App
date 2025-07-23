const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    email: String,
    photo: String,
    address: String,
    bday: Date,
    relation: String,
    gender: String,
    city: String,
    country: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    }
});


const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;