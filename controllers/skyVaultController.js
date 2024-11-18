import db from "../prisma/queries.js";

async function skyVaultGet(req, res, next) {
    // get all uploaded files
    const allFiles = await db.getAllFiles();
    
    // render page
    res.render("sky-vault", {
        title: "My files",
        fileList: allFiles,
    })
}

export default {
    skyVaultGet,
}