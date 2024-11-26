import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

// creates a bucket in the storage, named by username
async function createBucket(bucketName) {
    try {
        const { data, error } = await supabase.storage.createBucket(bucketName, {
            public: true, // TODO: configure it to private
            fileSizeLimit: "5MB",
        })

        if (error) {
            throw new Error(error);
        }
    
        console.log("Bucket created:");
        console.log(data);
    } catch (error) {
        throw new Error(error);
    }   
}

// upload a file to the supabase storage
async function uploadFile(bucketName, fileData, file){
    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileData.path, file);

    if (error) throw new Error(error);

    return data;
}

export default {
    createBucket,
    uploadFile,
}