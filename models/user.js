const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    photo: String,
    email: {
        type: String,
        required: true,
        unique: true, // ab unique hongi sab
    },
    dob: {
        type: Date
    },

}, { timestamps: true });

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const User = mongoose.model("User", userSchema);
User.init(); // this ensures indexes (like `unique: true`) 
module.exports = User;