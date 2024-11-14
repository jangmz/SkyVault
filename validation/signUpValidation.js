import { body } from "express-validator";
import db from "../prisma/queries.js";

// requirements
const signUpValidation = [
    body("username").trim().notEmpty()
        .custom(async username => {
            const usernameExists = await db.usernameExists(username);
            if (usernameExists) throw new Error("This username is already in use.");
        }),
    body("email").trim()
        .custom(async email => {
            const emailExists = await db.emailExists(email);
            if (emailExists) throw new Error("This email is already in use.");
        })
        .isEmail().withMessage(`Email is not the correct format. Enter it like so: example@mail.com`),
    body("password1").trim().notEmpty()
        .isLength({ min: 8 }).withMessage("Password is too short, minimum of 8 characters are required")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[\W_]/).withMessage("Password must contain at least one special character (#, $, !,...)"),
    body("password2").trim().notEmpty()
        .custom((value, {req}) => {
            if (value !== req.body.password1) {
                throw new Error("Passwords don't match!");
            }
            return true;
        })
];

export default signUpValidation;