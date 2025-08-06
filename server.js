const express = require("express");
const path = require("path");
const methodOverride = require('method-override');
const dotenv = require("dotenv");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const User = require("./models/user.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const home = require("./routes/home.js");
const login = require("./routes/login.js");
const register = require("./routes/register.js");
const folders = require("./routes/folder.js");
const profile = require("./routes/profile.js");

dotenv.config();


let app = express();
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));



app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.use(express.json());

app.use(express.urlencoded({
    extended: true,
    limit: '10mb', // increase payload size
    parameterLimit: 10000 // increase number of parameters allowed
}));
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    next();
});

// Must come AFTER session
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});


function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
}

const port = process.env.PORT || 8080;


// const MONGO_URL = process.env.MONGO_URL;

main().then(async() => {
    console.log("Main Connection Successsful");

    app.listen(port, () => {
        console.log("working");
    });

}).catch((err) => {
    console.log("Connection issue");
    console.log(err);
});

// mongoose.connect=

async function main() {
    await mongoose.connect('mongodb://localhost:27017/contactsDB' || process.env.MONGO_URI)
        .then(() => console.log("✅ MongoDB connected"))
        .catch(err => console.error("❌ MongoDB error:", err));

    console.log("Server started at: http://localhost:" + port);
};

app.use("/home", home);

app.use("/register", register);
app.use("/login", login);
app.use("/folders", folders);
app.use("/profile", profile);



app.get("/", (req, res) => {
    res.render("landing.ejs");
});

app.get("/about", (req, res) => {
    res.render("about.ejs", { addToFolder: false });
});
app.get("/features", (req, res) => {
    res.render("features.ejs", { addToFolder: false });
});

app.use((req, res) => {
    res.render("404.ejs", { addToFolder: false });
});