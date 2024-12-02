import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

// ensure shared bucket for users exists
async function sharedBucketCheck() {
    const bucketName = "user-files";

    try {
        const { data, error } = await supabase.storage.getBucket(bucketName);

        if (!data) {
            console.log(`Bucket "${bucketName}" not found. Creating it.`);
            const { error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true, // Make it private by default
            });

            if (createError) {
                throw new Error(`Failed to create bucket: ${createError.message}`);
            }
            console.log(`Bucket "${bucketName}" created successfully.`);
        }
    } catch (error) {
        throw new Error(`Bucket check failed: ${error.message}`);
    }

    console.log("Bucket check passed successfully.");
}

// create user's folder
async function createUserFolder(user) {
    const folderPath = `${user.username}/placeholder.txt`;
    try {
        const { error: folderError } = await supabase.storage
            .from("user-files")
            .upload(folderPath, Buffer.from(""), {
                upsert: true, // Create or update the folder
            });

        if (folderError) {
            throw new Error(`Failed to create folder: ${folderError.message}`);
        }
        console.log(`Folder created for user: ${user.username}`);
    } catch (error) {
        throw new Error(`User folder creation failed: ${error.message}`);
    }
}

// create folder (child)
async function createFolder(folderData) {
    try {
        const folderPath = `${folderData.path}/placeholder.txt`;
        const { data, error } = await supabase.storage
            .from("user-files")
            .upload(folderPath, Buffer.from(""), {
                upsert: false, // overwrite if file exists
        });

        if (error) throw new Error(`Failed to create folder: ${error.message}`);

        console.log(`Folder created:`);
        console.log(data);
    } catch (error) {
        throw new Error(`Folder creation failed: ${error.message}`);
    }
}

// get all files from the folder
async function filesFromFolder(folderPath) {
    const { data: files, error: filesError } = await supabase.storage
        .from("user-files")
        .list(folderPath, { limit: 300 });

    if (filesError) throw new Error("Error reading files from the folder");

    return files;
}

// delete all files in the folder
async function deleteAllFolderFiles(filePaths) {
    const { data: deleteData, error: deleteError } = await supabase.storage
        .from("user-files")
        .remove(filePaths);

    if (deleteError) throw new Error ("Failed to delete files: ", deleteError);

    console.log("Files deleted: ", deleteData);
}

// upload a file to the supabase storage
async function uploadFile(fileData){
    const { data, error } = await supabase.storage
        .from("user-files") // shared bucket
        .upload(fileData.path, fileData.buffer, {
            contentType: fileData.mimetype, // setting MIME type for proper file handling
            upsert: true, // overwrite if file exists
        });

    if (error) throw new Error(error);

    return data;
}

// return file download link
async function getFileUrl(filePath) {
    const { data, error } = await supabase.storage
        .from("user-files")
        .getPublicUrl(filePath);
    
    if (error) throw new Error(error);

    return data.publicUrl;
}

// update file name and path
async function updateFileNamePath(oldPath, newPath) {
    console.log(`${oldPath} --> ${newPath}`);
    // copy file to new location
    const { error: copyError } = await supabase.storage
        .from("user-files")
        .copy(oldPath, newPath);

    if (copyError) throw new Error(`Failed to copy new file(rename): ${oldPath} -> ${newPath} \nError: ${copyError.message}`);

    console.log(`File copied to: ${newPath}`);

    // delete old file
    const { error: deleteError } = await supabase.storage
        .from("user-files")
        .remove([oldPath]);

    if (deleteError) throw new Error(`Failed to delete old file (${oldPath}): ${deleteError.message}`);

    console.log(`File successfully renamed from ${oldPath} to ${newPath}`);
}

// delete file
async function deleteFile(filePath) {
    const { data, error } = await supabase.storage
        .from("user-files")
        .remove(filePath);
    
    if (error) {
        throw new Error("File deletion failed.");
    } else {
        console.log("File deleted: ", data);
    }
}

export default {
    //createBucket,
    sharedBucketCheck,
    createUserFolder,
    createFolder,
    filesFromFolder,
    deleteAllFolderFiles,
    uploadFile,
    getFileUrl,
    updateFileNamePath,
    deleteFile,
}