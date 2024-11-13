import {fileURLToPath} from "url";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

// setting public files and EJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// body-parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// bootstrap
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));

// session config (passport)
/*
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());
*/

// middleware
//app.use(setLocalsUser);
//app.use(loggs);

// routes

// error handler
//app.use(errorHandler);

// app running
app.listen(PORT, () => console.log(`App is running on port ${PORT}`));