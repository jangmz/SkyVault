function logInGet(req, res, next) {
    res.render("log-in", {
        title: "Log In"
    });
}

function logInPost(req, res, next) {
    // log in logic
}

export default {
    logInGet,
    logInPost,
}