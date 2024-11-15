import db from "../prisma/queries.js";
import { matchedData, validationResult } from "express-validator";
import bcrypt from "bcryptjs";

// GET /sign-up -> sign up form
function signUpGet(req, res, next) {
    res.render("sign-up", {
        title: "Sign Up"
    })
}

// POST /sign-up -> validate input and enter into database
async function signUpPost(req, res, next) {
    const errors = validationResult(req);
    /*
        TODO: this error validation handling is not working properly
    */
    if (!errors.isEmpty()) {
        let details = "";
        errors.array().map(error => {
            details = details + error.msg + " ";
        })

        const error = new Error();
        error.status = 400;
        error.details = details;

        return next(error); // error handling middleware
    }

    const user = matchedData(req); // save form data

    // encrypt password
    try {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password1, saltRounds);
    } catch (error) {
        return next(error);
    }

    // insert data into database
    await db.createUser(user);

    res.render("log-in", {
        title: "Log In"
    });
}

export default {
    signUpGet,
    signUpPost,
}