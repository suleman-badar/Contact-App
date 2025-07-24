const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Contact = require("./models/contact.js");
const User = require("./models/user.js");
const Folder = require("./models/folder.js");
const multer = require("multer");
const { storage } = require("./cloudinaryConfig");
const session = require("express-session");
// const { faker } = require("@faker-js/faker");
// const { name } = require("ejs");
const methodOverride = require('method-override');
const dotenv = require("dotenv");

dotenv.config();

const upload = multer({ storage });

let app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


app.use(express.urlencoded({
    extended: true,
    limit: '10mb', // increase payload size
    parameterLimit: 10000 // increase number of parameters allowed
}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'MNB02M524', // use a secure secret in production
    resave: false,
    saveUninitialized: false
}));



// const fakeUserId = '687a25b75f659c85dadadc25';


// const createFakeContacts = async(count) => {
//     const contacts = [];

//     for (let i = 0; i < count; i++) {
//         contacts.push({
//             name: faker.person.fullName(),
//             number: faker.phone.number('+92 3## #######'),
//             email: faker.internet.email(),
//             address: faker.location.streetAddress(),
//             bday: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
//             relation: faker.word.adjective(),
//             gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
//             city: faker.location.city(),
//             country: faker.location.country(),
//             photo: faker.image.avatar(),
//             userId: fakeUserId,
//         });
//     }

//     await Contact.insertMany(contacts);
//     console.log(`${count} fake contacts added!`);
// };


const port = 8080 || process.env.PORT;

// const MONGO_URL = process.env.MONGO_URL;

main().then(async() => {
    console.log("Main Connection Successsful");
    // await createFakeContacts(5);

    app.listen(port, () => {
        console.log("working");
    });

}).catch((err) => {
    console.log(err)
});

// mongoose.connect=

async function main() {
    await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("✅ MongoDB connected"))
        .catch(err => console.error("❌ MongoDB error:", err));
    
    console.log("Server started at: http://localhost:" + port);
};

app.get("/", (req, res) => {
    res.render("landing.ejs");
});

app.get("/home", async(req, res) => {
    if (!req.session.userId) return res.redirect("/login");
    try {
        let flag = true;
        const userId = req.session.userId;
        const user = await User.findById(userId);
        const allContacts = await Contact.find({ userId });
        const allFolders = await Folder.find({ userId });
        const folderFlag = req.query.addToFolder === "true";
        const folderId = req.query.folderId;

        res.render("home", { allContacts, allFolders, userId, userPhoto: user.photo, flag, folderFlag, folderId }); // send contacts to EJS
    } catch (err) {
        res.status(500).send("Error loading contacts: " + err.message);
    }
});

// search engine
app.get("/home/search", async(req, res) => {
    if (!req.session.userId) return res.redirect("/login");
    try {
        let { search } = req.query;
        let userId = req.session.userId;
        const filter = { userId };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { number: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ]
        }
        let flag = true;
        const user = await User.findById(userId);
        const contacts = await Contact.find(filter);
        res.render("home", { allContacts: contacts, userId, userPhoto: user.photo, flag, folderFlag: false })
    } catch (err) {
        res.status(500).send("Error searching contact: " + err.message);
    }
});

//to get folders
app.get("/folders", async(req, res) => {
    if (!req.session.userId) return res.redirect("/login");
    try {
        let flag = false;
        const user = await User.findById(req.session.userId);
        const allFolders = await Folder.find({ userId: req.session.userId });
        res.render("home", { allFolders, userId: req.session.userId, userPhoto: user.photo, flag, folderFlag: true }); // send contacts to EJS
    } catch (err) {
        res.status(500).send("Error loading contacts: " + err.message);
    }
});

// to add contacts to a folder 
app.post("/home/add-to-folder", async(req, res) => {
    try {
        const { folderId, contactIds } = req.body;
        if (!folderId || !contactIds) {
            return res.status(400).send("Missing folderId or contactIds");
        }

        await Folder.findByIdAndUpdate(folderId, {
            $addToSet: { contacts: { $each: Array.isArray(contactIds) ? contactIds : [contactIds] } }
        });

        res.redirect("/folders"); // or redirect to /folders if that's where you're showing them
    } catch (err) {
        console.error("Error creating folder:", err);
        res.status(500).send("Error creating folder: " + err.message);
    }
});


//to create new folders
app.post("/folders/create", async(req, res) => {
    try {
        const { name } = req.body;
        const userId = req.session.userId;

        if (!name) return res.status(400).send("Missing folder name");

        const newFolder = new Folder({ name, userId });
        await newFolder.save();
        res.redirect("/folders");
    } catch (err) {
        console.error("Error creating folder:", err);
        res.status(500).send("Error creating folder: " + err.message);
    }
});


//to open contacts present in each folder
app.get("/folders/:folderId", async(req, res) => {
    try {
        const folderId = req.params.folderId;
        const folder = await Folder.findById(folderId).populate("contacts");
        const allContacts = await Contact.find({ folderId });
        const userId = req.session.userId;
        const user = await User.findById(userId);

        res.render("home", {
            allContacts: folder.contacts,
            userId,
            userPhoto: user.photo,
            flag: true,
            folderFlag: false
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Error opening folder: " + err.message);
    }
});

//to delete folders
app.delete("/folders/delete/:folderId", async(req, res) => {
    try {
        const folderId = req.params.folderId;
        await Folder.findByIdAndDelete(folderId);
        res.redirect("/folders");
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Error deleting folder: " + err.message);
    }
});





app.get("/login", (req, res) => {
    res.render("login", {
        email: "",
        emailError: null,
        passwordError: null,
        generalError: null  
    });
});

app.get("/register", (req, res) => {
    res.render("register", {
        error: '',
        email: '',
        name: ''
    });
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

        let photoPath = req.file ? req.file.path : '';

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
            userId: req.session.userId,
            folderId: req.body.folderId
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
        let photoPath = req.file ? req.file.path : contact.photo;

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


//delete multiple
app.delete("/home/delete-mul", async(req, res) => {
    let contactIds = req.body.contactIds;
    if (!Array.isArray(contactIds)) {
        contactIds = [contactIds];
    }
    try {
        await Contact.deleteMany({ _id: { $in: contactIds } });
        res.redirect("/home");
    } catch (err) {
        console.error("Failed to delete contacts:", err);
        res.status(500).send("Error deleting contacts.");
    }
});


//sending login details to database
app.post("/register", upload.single("photo"), async (req, res) => {
    try {
        const { name, email, password, confirmPass } = req.body;

        if (password !== confirmPass) {
            return res.status(400).render("register", {
                error: "❌ Passwords do not match.",
                email,
                name,
            });
        }

        if (password.length < 8) {
            return res.render("register", {
                error: "Password must be at least 8 characters long",
                email,
                name
            });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render("register", {
                error: "⚠️ A user with this email already exists.",
                email,
                name,
            });
        }

        const photoPath = req.file ? req.file.path : "";

        const user = new User({
            name,
            photo: photoPath,
            email,
            password,
        });
        await user.save();
        res.redirect("/login");
    } catch (err) {
        res.status(500).render("register", {
            error: "❌ Something went wrong. Try again later.",
        });
    }
});


//checking user credentials to let them login

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render("login", {
                email,
                emailError: "❌ User not found.",
                passwordError: undefined
            });
        }

        if (user.password !== password) {
            return res.render("login", {
                email,
                emailError: undefined,
                passwordError: "❌ Incorrect password."
            });
        }

        req.session.userId = user._id;
        return res.redirect("/home");

    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error: " + err.message);
    }
});
