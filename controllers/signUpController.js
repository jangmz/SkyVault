import db from "../prisma/queries.js";
import supabase from "../supabase/supabase.js";
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

        return next(error);
    }

    const user = matchedData(req); // save form data

    try {
        // encrypt password
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password1, saltRounds);

        // insert user into the database
        await db.createUser(user);
        console.log(`User added to database: ${user.username}`);

        // ensure shared bucket exists
        await supabase.sharedBucketCheck();

        // create users folder
        await supabase.createUserFolder(user);

        res.render("log-in", {
            title: "Log In"
        });
    } catch (error) {
        console.error(`Error in sign up process: ${error.message}`);
        return next(error);
    }
}

export default {
    signUpGet,
    signUpPost,
}