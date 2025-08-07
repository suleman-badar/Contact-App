if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const methodOverride = require('method-override');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");

const User = require("./models/user.js");
const home = require("./routes/home.js");
const login = require("./routes/login.js");
const register = require("./routes/register.js");
const folders = require("./routes/folder.js");
const profile = require("./routes/profile.js");

const app = express();
const port = process.env.PORT || 8080;

// View engine setup
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
    limit: '10mb',
    parameterLimit: 10000
}));

// MongoDB URL
const MONGO_URL = process.env.MONGO_URI;

// MongoDB connection
async function main() {
    await mongoose.connect(MONGO_URL)
        .then(() => console.log("✅ MongoDB connected"))
        .catch(err => {
            console.error("❌ MongoDB error:", err);
            process.exit(1);
        });
}

main().then(() => {
    console.log("Main Connection Successful");

    app.listen(port, () => {
        console.log(`🚀 Server started on port ${port}`);
    });
}).catch(err => {
    console.log("Connection issue:", err);
});

// Session Store
const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.MONGO_STORE_SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("❌ Error in Mongo Session Store:", err);
});

// Session Configuration
const sessionOptions = {
    store,
    secret: process.env.EXPRESS_SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash and User Locals
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

// Routes
app.use("/home", home);
app.use("/register", register);
app.use("/login", login);
app.use("/folders", folders);
app.use("/profile", profile);

// Static Pages
app.get("/", (req, res) => {
    res.render("landing.ejs");
});

app.get("/about", (req, res) => {
    res.render("about.ejs", { addToFolder: false });
});

app.get("/features", (req, res) => {
    res.render("features.ejs", { addToFolder: false });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render("404.ejs", { addToFolder: false });
});