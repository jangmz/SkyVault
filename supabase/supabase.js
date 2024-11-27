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
                public: false, // Make it private by default
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

// upload a file to the supabase storage
async function uploadFile(fileData){
    const { data, error } = await supabase.storage
        .from("user-files") // shared bucket
        .upload(fileData.path, fileData);

    if (error) throw new Error(error);

    return data;
}

export default {
    //createBucket,
    sharedBucketCheck,
    createUserFolder,
    uploadFile,
}