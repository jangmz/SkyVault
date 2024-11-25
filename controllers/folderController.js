import db from "../prisma/queries.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";

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

// POST /folders/create -> create new folder in the filesystem/cloud, add referance to the database
async function folderPost(req, res, next) {
    const folderPath = path.join(__dirname, `../public/uploads/${req.body.foldername}`);

    // creates folder reference for DB
    const folderData = {
        name: req.body.foldername,
        created: new Date().toLocaleDateString(),
        path: folderPath,
        userID: req.user.id,
        parentID: parseInt(req.body.parentFolder) || null,
    }

    // create folder in the filesystem
    try {
        if (!fs.existsSync(folderData.path)) {
            fs.mkdirSync(folderData.path);
        }
    } catch (error) {
        console.error(error);
    }

    // insert folderData into DB
    await db.createFolder(folderData);

    res.redirect("/sky-vault");
}

export default {
    folderGet,
    folderPost,
}