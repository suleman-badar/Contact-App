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
    }
});

const folder = mongoose.model("folder", folderSchema);
module.exports = folder;