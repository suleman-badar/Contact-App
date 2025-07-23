const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const folderSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact' // Make sure your model name is 'Contact'
    }]

});

const Folder = mongoose.model("Folder", folderSchema);
module.exports = Folder;