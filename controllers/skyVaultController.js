import db from "../prisma/queries.js";
import fs from "node:fs";

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

// POST /sky-vault/delete-file/:fileID 
async function deleteFilePost(req, res, next){
    // delete file in the filesystem
    const filePath = await db.getFilePath(parseInt(req.params.fileID));
    
    fs.unlink(filePath, (error) => {
        if (error) {
            next(error);
        }

        console.log(`File: ${filePath} has been removed from the filesystem.`);
    });

    // delete file in DB
    try {
        await db.deleteFile(parseInt(req.params.fileID));
    } catch (error) {
        next(error);
    }

    res.redirect("/sky-vault");
}

// GET /sky-vault/edit-file/:fileID -> form for editing file
function editFileGet(req, res, next) {

}

// POST /sky-vault/edit-file/:fileID -> logic for updating db record
async function editFilePost(req, res, next) {
    // update file in the filesystem

    // udpate file in DB
}

export default {
    skyVaultGet,
    skyVaultFolderGet,
    deleteFilePost,
    editFileGet,
    editFilePost,
}