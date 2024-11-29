import db from "../prisma/queries.js";
import supabase from "../supabase/supabase.js";
import fs from "node:fs";
import path from "path";

// GET /sky-vault -> root folders and files
async function skyVaultGet(req, res, next) {
    // get users folders and files
    const { folders, files } = await db.getFolderContent(req.user.id, null);

    // render page
    res.render("sky-vault", {
        title: "My files",
        currentFolderId: null, // null = root folder
        parentFolder: null,
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
        parentFolder: folder.parentID,
        folders,
        files
    });
}

// GET /sky-vault/delete-file/:fileID 
async function deleteFile(req, res, next){
    const filePath = await db.getFilePath(parseInt(req.params.fileID));
    
    try {
        // remove file in the cloud
        await supabase.deleteFile(filePath);

        // remove file in DB
        await db.deleteFile(req.user.id, parseInt(req.params.fileID));
    } catch (error) {
        return next(error);
    }

    res.redirect("/sky-vault");
}

// GET /sky-vault/edit-file/:fileID -> form for editing file
async function editFileGet(req, res, next) {
    const fileID = parseInt(req.params.fileID);

    const file = await db.getFileData(fileID);

    res.render("edit-file", {
        title: "Edit file",
        file
    });
}

// POST /sky-vault/edit-file/:fileID -> logic for updating db record
async function editFilePost(req, res, next) {
    const file = await db.getFileData(parseInt(req.params.fileID));
    const newFileName = req.body.filename;
    const newPath = path.join(path.dirname(file.path), newFileName);

    // update file in filesystem
    fs.rename(file.path, newPath, (error) => {
        if (error) {
            next(error);
        }
    });

    // update file in DB
    file.path = newPath;
    file.name = newFileName;
    
    try {
        await db.updateFileData(req.user.id, file);
        console.log("File data updated.");
    } catch (error) {
        next(error);
    }
    
    res.redirect(`/sky-vault`);
}

// GET /sky-vault/delete-folder/:folderID
async function deleteFolder(req, res, next) {
    // delete folder in filesystem (with all it's files)
    const folder = await db.getFolderData(req.user.id, parseInt(req.params.folderID));
    
    // ensure folder path ends with "/"
    if (!folder.path.endsWith("/")) {
        folder.path += "/";
    }

    // get all files in the folder (to be deleted) from the cloud
    const files = await supabase.filesFromFolder(folder.path);
    
    // creates an array of file paths to delete
    const filePaths = files.map(file => `${folder.path}${file.name}`);

    try {
        // delete files in cloud
        await supabase.deleteAllFolderFiles(filePaths);

        // delete files in DB
        await db.deleteFolderAndFiles(req.user.id, parseInt(req.params.folderID));
    } catch (error) {
        return next(error);
    }

    res.redirect("/sky-vault");
}

// GET /sky-vault/edit-folder/:folderID -> form for data folder update
async function editFolderGet(req, res, next) {
    const folderID = parseInt(req.params.folderID);

    const folder = await db.getFolderData(req.user.id, folderID);

    res.render("edit-folder", {
        title: "Edit folder",
        folder
    })
}

// POST /sky-vault/edit-folder/:folderID -> update folder data in filesystem and DB
async function editFolderPost(req, res, next) {
    const folder = await db.getFolderData(req.user.id, parseInt(req.params.folderID));
    const newFolderName = req.body.foldername;
    const newPath = path.join(path.dirname(folder.path), newFolderName);

    // update folder in filesystem
    fs.rename(folder.path, newPath, (error) => {
        if (error) {
            next(error);
        }
    });

    // update folder in DB
    folder.path = newPath;
    folder.name = newFolderName;
    try {
        await db.updateFolder(req.user.id, folder);
        console.log("Folder data updated.");
    } catch (error) {
        next(error);
    }
    
    res.redirect(`/sky-vault/folder/${req.params.folderID}`);
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