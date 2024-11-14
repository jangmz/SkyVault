import db from "../prisma/queries.js";

function signUpGet(req, res, next) {
    res.render("sign-up", {
        title: "Sign Up"
    })
}

async function signUpPost(req, res, next) {
    // TODO: sanitization & validation of user data
    const user = req.body;

    await db.createUser(user);

    res.render("log-in", {
        title: "Log In"
    });
}

export default {
    signUpGet,
    signUpPost,
}