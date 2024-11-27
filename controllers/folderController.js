import db from "../prisma/queries.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";
import supabase from "../supabase/supabase.js";

const __filename = fileURLToPath(import.meta.url); // current file
const __dirname = path.dirname(__filename); // current directory

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
    //const folderPath = path.join(__dirname, `../public/uploads/${req.body.foldername}`);
    // TODO: Fix path if you are making folder inside a folder (recursion?)
    const folderPath = `user-files/${req.user.username}/${req.body.foldername}`;

    // creates folder reference for DB
    const folderData = {
        name: req.body.foldername,
        created: new Date().toLocaleDateString(),
        path: folderPath,
        userID: req.user.id,
        parentID: parseInt(req.body.parentFolder) || null,
    }

    /*
    // create folder in the filesystem
    try {
        if (!fs.existsSync(folderData.path)) {
            fs.mkdirSync(folderData.path);
        }
    } catch (error) {
        console.error(error);
    }
    */ 
    try {
        // create folder in supabase
        await supabase.createFolder(req.user, folderData);
        
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