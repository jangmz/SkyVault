import db from "../prisma/queries.js";

// GET /sky-vault -> root folders and files
async function skyVaultGet(req, res, next) {
    // get users folders and files
    const { folders, files } = await db.getFolderContent(req.user.id, null);

    // render page
    res.render("sky-vault", {
        title: "My files",
        currentFolderId: null, // null = root folder
        folders,
        files
    });
}

// GET /sky-vault/folder/:folderID -> subfolder and files of specific folder
async function skyVaultFolderGet(req, res, next) {
    // get folder subfolders and files
    const folderID = parseInt(req.params.folderID);
    const { folders, files } = await db.getFolderContent(req.user.id, folderID);

    // get folder name for title
    const folder = await db.getFolderData(folderID);
    
    // render page
    res.render("sky-vault", {
        title: folder.name,
        currentFolderId: folderID,
        folders,
        files
    });
}

export default {
    skyVaultGet,
    skyVaultFolderGet,
}