import db from "../prisma/queries.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import supabase from "../supabase/supabase.js";

const __filename = fileURLToPath(import.meta.url); // current file
const __dirname = path.dirname(__filename); // current directory

// store files in memory temporarily
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024}, // 5MB limit
})

// GET /upload -> upload form
async function uploadGet(req, res, next) {
    // get user folders to be displayed in the form
    const userFolders = await db.getFoldersByUserID(req.user.id);

    res.render("upload", {
        title: "File upload",
        folders: userFolders
    });
}

// POST /upload -> upload to cloud
async function uploadPost(req, res, next) {
    // check if there is a file
    if (!req.file) {
        const error = new Error({
            message: "Upload error",
            details: "No file uploaded."
        });
        return next(error);
    } 

    // create metadata
    const fileData = req.file;
    let folderPath = "";

    fileData.created = new Date().toLocaleDateString(); // format: DD/MM/YYYY
    fileData.userID = req.user.id;
    fileData.folderID = req.body.folder ? parseInt(req.body.folder) : null; // "null" if uploaded to root
    fileData.buffer = req.file.buffer; // buffer from multer memoryStorage

    // resolve full folder path from folder hierarchy
    async function resolveFolderPath(folderID) {
        const folder = await db.getFolderData(req.user.id, folderID);
        if (folder) {
            folderPath = `${folder.name}/${folderPath}`;
            if (folder.parentID) {
                await resolveFolderPath(folder.parentID);
            }
        }
    }

    if (fileData.folderID) {
        await resolveFolderPath(fileData.folderID);
    }

    fileData.path = `${req.user.username}/${folderPath}${fileData.originalname}`.replace(/\/\//g, "/");

    console.log(fileData);
    
    try {
        // upload file to supabase
        const uploadedFile = await supabase.uploadFile(fileData);
        console.log("File uploaded:", uploadedFile);

        // get a download link to the file
        const downloadUrl = await supabase.getFileUrl(uploadedFile.path);
        fileData.url = `${downloadUrl}?download`;
        console.log(`Download link: ${fileData.url}`);

        // insert data into database
        await db.insertFile(fileData);

    } catch (error) {
        return next(error);
    }

    res.redirect("/sky-vault");
}

export default {
    upload,
    uploadGet,
    uploadPost,
}