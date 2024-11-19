import db from "../prisma/queries.js";

async function skyVaultGet(req, res, next) {
    // get users uploaded files by ID
    const userFiles = await db.getAllFilesByUserID(req.user.id);

    // group files by folder
    const filesByFolder = userFiles.reduce((acc, file) => {
        // handle if file is not in folder
        const folderName = file.folder ? file.folder.name : "No folder";
        
        // grouping
        if (!acc[folderName]) {
            acc[folderName] = [];
        }
        acc[folderName].push(file);
        
        return acc;
    }, {});

    if (filesByFolder) {
        console.log(filesByFolder);
    }
    
    
    // render page
    res.render("sky-vault", {
        title: "My files",
        filesByFolder: filesByFolder,
    })
}

export default {
    skyVaultGet,
}