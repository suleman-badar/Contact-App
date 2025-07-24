// cloudinaryConfig.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");


cloudinary.config({
    cloud_name: "dykrtjrax",
    api_key: "242212321238251",
    api_secret: process.env.CLOUDINARY_API_KEY,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "contactsApp", // folder name in Cloudinary
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

module.exports = {
    cloudinary,
    storage,
};