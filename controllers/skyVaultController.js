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
    const folder = await db.getFolderData(req.user.id, folderID);
    
    // render page
    res.render("sky-vault", {
        title: folder.name,
        currentFolderId: folderID,
        folders,
        files
    });
}

// GET /sky-vault/delete-file/:fileID 
async function deleteFile(req, res, next){
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
        await db.deleteFile(req.user.id, parseInt(req.params.fileID));
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

// GET /sky-vault/delete-folder/:folderID
async function deleteFolder(req, res, next) {
    // delete folder in filesystem (with all it's files)
    const folder = await db.getFolderData(req.user.id, parseInt(req.params.folderID));
    //const folderFiles = folder.File;

    fs.rm(folder.path, { recursive: true }, (error) => {
        if (error) {
            next(error);
        }

        console.log(`Folder "${folder.name}", all its subfolders & files have been deleted.`);
    });

    try {
        await db.deleteFolderAndFiles(req.user.id, parseInt(req.params.folderID));
    } catch (error) {
        next(error);
    }

    res.redirect("/sky-vault");
}

// GET /sky-vault/edit-folder/:folderID -> form for data folder update
function editFolderGet(req, res, next) {

}

// POST /sky-vault/edit-folder/:folderID -> update folder data in filesystem and DB
async function editFolderPost(req, res, next) {
    // update folder in filesystem

    // update folder in DB
}

export default {
    skyVaultGet,
    skyVaultFolderGet,
    deleteFile,
    editFileGet,
    editFilePost,
    deleteFolder,
    editFolderGet,
    editFolderPost,
}