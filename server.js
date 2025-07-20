const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Contact = require("./models/contact.js");
const User = require("./models/user.js");
const Folder = require("./models/folder.js");
const multer = require("multer");
const session = require("express-session");
const { faker } = require("@faker-js/faker")



const methodOverride = require('method-override');


let app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret-key', // use a secure secret in production
    resave: false,
    saveUninitialized: false
}));
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads'); // saves to public/uploads/
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });


const fakeUserId = '687a25b75f659c85dadadc25';

const createFakeContacts = async(count) => {
    const contacts = [];

    for (let i = 0; i < count; i++) {
        contacts.push({
            name: faker.person.fullName(),
            number: faker.phone.number('+92 3## #######'),
            email: faker.internet.email(),
            address: faker.location.streetAddress(),
            bday: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
            relation: faker.word.adjective(),
            gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
            city: faker.location.city(),
            country: faker.location.country(),
            photo: faker.image.avatar(),
            userId: fakeUserId,
        });
    }

    await Contact.insertMany(contacts);
    console.log(`${count} fake contacts added!`);
};


const port = 8080;

const MONGO_URL = "mongodb://127.0.0.1:27017/contactsDB";

main().then(async() => {
    console.log("Main Connection Successsful");
    await createFakeContacts(20);
    // if (count === 0) {
    //     await createFakeContacts(20);
    // } else {
    //     console.log("Fake contacts already exist. Skipping insert.");
    // }

    app.listen(port, () => {
        console.log("working");
    });

}).catch((err) => {
    console.log(err)
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.get("/", (req, res) => {
    res.render("landing.ejs");
});

app.get("/home", async(req, res) => {
    if (!req.session.userId) return res.redirect("/login");
    try {
        let flag = true;
        const user = await User.findById(req.session.userId);
        const allContacts = await Contact.find({ userId: req.session.userId });
        res.render("home", { allContacts, userId: req.session.userId, userPhoto: user.photo, flag }); // send contacts to EJS
    } catch (err) {
        res.status(500).send("Error loading contacts: " + err.message);
    }
});

app.get("/folders", async(req, res) => {
    if (!req.session.userId) return res.redirect("/login");
    try {
        let flag = false;
        const user = await User.findById(req.session.userId);
        const allFolders = await Folder.find({ userId: req.session.userId });
        res.render("home", { allFolders, userId: req.session.userId, userPhoto: user.photo, flag }); // send contacts to EJS
    } catch (err) {
        res.status(500).send("Error loading contacts: " + err.message);
    }
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});
app.get("/features", (req, res) => {
    res.render("features.ejs");
});
app.get("/home/add-contact", (req, res) => {
    res.render("add-contact.ejs");
});
app.get("/home/help", (req, res) => {
    res.render("help.ejs");
});





//adding form data to dataBase
app.post("/home/add-contact", upload.single('photo'), async(req, res) => {
    try {
        if (!req.session.userId) return res.status(403).send("Login required");
        const { name, number, email, photo, address, bday, relation, gender, city, country } = req.body;

        let photoPath = req.file ? `/uploads/${req.file.filename}` : '';
        let newContact = new Contact({
            name,
            number,
            email,
            photo: photoPath,
            address,
            bday,
            relation,
            gender,
            city,
            country,
            userId: req.session.userId
        });
        await newContact.save();
        res.redirect('/home');
    } catch (err) {
        res.status(500).send('Error saving contact: ' + err.message);
    }
});

//Individual data fetching
app.get("/home/info/:id", async(req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).send("Contact not found");
        res.render("info.ejs", { contact });
    } catch (err) {
        res.status(500).send("Error fetching contact: " + err.message);
    }
});

//rendering to edit page of individual contact
app.get("/home/edit/:id", async(req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).send("Contact not found");
        res.render("edit.ejs", { contact });
    } catch (err) {
        res.status(500).send("Error fetching contact: " + err.message);
    }
});

//rendering to profile of user
app.get("/home/profile/:id", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("Contact not found");
        res.render("profile.ejs", { user });
    } catch (err) {
        res.status(500).send("Error fetching contact: " + err.message);
    }
});

//put request for edited data
app.put("/home/edit/:id", upload.single("photo"), async(req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        const {
            name,
            number,
            email,
            photo,
            address,
            bday,
            relation,
            gender,
            city,
            country
        } = req.body;
        let photoPath = req.file ? `/uploads/${req.file.filename}` : contact.photo;
        await Contact.findByIdAndUpdate(req.params.id, {
            name,
            number,
            email,
            photo: photoPath,
            address,
            bday,
            relation,
            gender,
            city,
            country
        });
        res.redirect("/home");
    } catch (err) {
        res.status(500).send("Error fetching contact: " + err.message);
    }
});

//delete request
app.delete("/home/delete/:id", async(req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.redirect("/home");
    } catch (err) {
        res.status(500).send("Error fetching contact: " + err.message);
    }
});


//sending login details to database
app.post("/register", upload.single("photo"), async(req, res) => {
    try {
        const { name, email, photo, password, confirmPass } = req.body;
        let photoPath = req.file ? `/uploads/${req.file.filename}` : user.photo;
        if (password != confirmPass) {
            return res.send("Passwords do not match.");
        }
        const user = new User({
            name,
            photo: photoPath,
            email,
            password
        });
        await user.save();
        res.redirect("/login");
    } catch (err) {
        res.status(500).send("❌ Error registering user: " + err.message);
    }
});

//checking user credentials to let them login

app.put("/login", async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.send("❌ User not found.");
        }
        if (user.password != password) {
            return res.send("❌ Incorrect Password.");
        }
        req.session.userId = user._id;
        res.redirect("/home");
    } catch (err) {
        res.status(500).send("Server error: " + err.message);
    }
})