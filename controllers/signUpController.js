function signUpGet(req, res, next) {
    res.render("sign-up", {
        title: "Sign Up form"
    })
}

export default {
    signUpGet,
}