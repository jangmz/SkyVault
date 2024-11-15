function skyVaultGet(req, res, next) {
    res.render("sky-vault", {
        title: "My files"
    })
}

export default {
    skyVaultGet,
}