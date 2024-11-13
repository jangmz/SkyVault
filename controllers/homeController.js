function homeGet(req, res, next) {
    res.render("home", {
        title: "SkyVault",
        data: "Some data",
    });
}

export default {
    homeGet,
}