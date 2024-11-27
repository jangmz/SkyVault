import db from "../prisma/queries.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import supabase from "../supabase/supabase.js";

const __filename = fileURLToPath(import.meta.url); // current file
const __dirname = path.dirname(__filename); // current directory

/*
// configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/uploads")); // saves files to ./public/uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`); // file name: 1687156034123-test.txt
    }
});

// Multer upload instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit upload file size
})
*/

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

// POST /upload -> upload to filesystem / upload to cloud (later)
async function uploadPost(req, res, next) {
    // check if there is a file
    if (!req.file) {
        const error = new Error({
            message: "Upload error",
            details: "No file uploaded."
        });
        next(error);
    } 

    // create metadata
    const userFolder = req.user.username;
    const fileData = req.file;

    fileData.created = new Date().toLocaleDateString(); // format: DD/MM/YYYY
    fileData.userID = req.user.id;
    // set "null" if there are no folders or if "No Folder" is selected"
    fileData.folderID = req.body.folder === undefined || null ? null : parseInt(req.body.folder);
    fileData.path = `user-files/${userFolder}/${fileData.originalname}`; // TODO: add folder before "originalname" if file is inserted into the folder 
    // TODO: create a reference to file URL for downloading

    console.log(fileData);
    
    try {
        // upload file to supabase
        const uploadedFile = await supabase.uploadFile(fileData);
        console.log("File uploaded:");
        console.log(uploadedFile);

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

/*
FILE DATA:

    fieldname: "file"
    originalname: "test_upload.txt"
    encoding: 7bit
    mimetype: "text/plain"
    destination: "../public/uploads"
    filename: "asdaoasdoiufsdf8sdf87sdf"
    path: "../public/uploads/asdaoasdoiufsdf8sdf87sdf"
    size: 25
    created: "18/11/2024"
*/