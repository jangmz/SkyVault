import {fileURLToPath} from "url";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { Prisma, PrismaClient } from "@prisma/client";
import expressEjsLayouts from "express-ejs-layouts";
import passport from "passport";
import homeRouter from "./routes/homeRouter.js";
import signUpRouter from "./routes/signUpRouter.js";
import logInRouter from "./routes/logInRouter.js";
import logOutRouter from "./routes/logOutRouter.js";
import { errorHandler } from "./middleware/error.js";
import skyVaultRouter from "./routes/skyVaultRouter.js";

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

// ejs layouts
app.use(expressEjsLayouts);
app.set("layout", "layout"); // default layout file

// bootstrap
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));

// session config 
app.use(
    expressSession({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // ms
        },
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod: 2 * 60 * 1000, // in ms, expired sessions are automatically removed
                dbRecordIdIsSessionId: true, // session ID = prisma record ID
                dbRecordIdFunction: undefined, // function to generate prisma record ID for a given session ID
            }
        )
    })
)
/*
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

*/
// middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandler);
//app.use(setLocalsUser);
//app.use(loggs);

// routes
app.use("/", homeRouter);
app.use("/sign-up", signUpRouter);
app.use("/log-in", logInRouter);
app.use("/log-out", logOutRouter);
app.use("/sky-vault", skyVaultRouter);

// app running
app.listen(PORT, () => console.log(`App is running on port ${PORT}`));