import db from "../prisma/queries.js";

async function skyVaultGet(req, res, next) {
    // get users uploaded files by ID
    const userFiles = await db.getAllFilesByUserID(req.user.id);
    
    // render page
    res.render("sky-vault", {
        title: "My files",
        fileList: userFiles,
    })
}

export default {
    skyVaultGet,
}