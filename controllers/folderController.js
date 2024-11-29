import db from "../prisma/queries.js";
import supabase from "../supabase/supabase.js";

// GET /folders/create -> form for creating a new folder
async function folderGet(req, res, next) {
    // get current user folders
    const folders = await db.getFoldersByUserID(req.user.id);

    res.render("create-folder", {
        title: "Create new folder",
        folders,
    });
}

// POST /folders/create -> create new folder in the filesystem/cloud, add reference to the database
async function folderPost(req, res, next) {
    
    // recursively building folder path
    async function buildFolderPath(parentID, childName) {
        if (!parentID) {
            return `${req.user.username}/${childName}`; // root folder
        }

        const parentFolderData = await db.getFolderData(req.user.id, parseInt(parentID));
        if(!parentFolderData) {
            throw new Error("Parent folder not found");
        }

        const parentPath = await buildFolderPath(parentFolderData.parentID, parentFolderData.name); // call recursively if parent has a parent
        return `${parentPath}/${childName}`;
    }

    try {
        // get full path to the folder
        const parentID = req.body.parentFolder ? parseInt(req.body.parentFolder) : null;
        const folderPath = await buildFolderPath(parentID, req.body.foldername);

        // creates folder reference for DB
        const folderData = {
            name: req.body.foldername,
            created: new Date().toLocaleDateString(),
            path: folderPath,
            userID: req.user.id,
            parentID: parentID,
        }

        // create folder in supabase
        await supabase.createFolder(folderData);
        
        // insert folderData into DB
        await db.createFolder(folderData);
    } catch (error) {
        return next(error);
    }

    res.redirect("/sky-vault");
}

export default {
    folderGet,
    folderPost,
}