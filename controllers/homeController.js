function homeGet(req, res, next) {
    res.redirect("/log-in");
}

export default {
    homeGet,
}