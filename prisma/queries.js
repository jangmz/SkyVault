import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
        ===== USERS =====
*/

// creates a new user
async function createUser(user) {
    try {
        const userData = await prisma.user.create({
            data: {
                username: user.username,
                password: user.password,
                email: user.email
            }
        })
        console.log("User added.");
        console.log(userData);
    } catch (error) {
        console.error(error);
        return error;
    }
}

// find user by username
async function findUserByUsername(username) {
    const user = await prisma.user.findMany({
        where: {
            username: username,
        }
    });

    return user;
} 

// find user by id
async function findUserById(userID) {
    const user = await prisma.user.findUnique({
        where: {
            id: userID
        }
    });

    return user;
}

// returns true/false if a user exists 
async function usernameExists(username) {
    const user = await prisma.user.findMany({
        where: {
            username: username,
        }
    })

    if (user.length !== 0) return true;
    else return false;
}

// returns true/false if email exists
async function emailExists(email) {
    const user = await prisma.user.findMany({
        where: {
            email: email
        }
    })

    if (user.length !== 0) return true;
    else return false;
}

/*
        ===== FILES =====
*/

// insert new uploaded file data
async function insertFile(fileData) {
    try {
        const file = await prisma.file.create({
            data: {
                name: fileData.originalname,
                type: fileData.mimetype,
                size: fileData.size,
                created: fileData.created,
                path: fileData.path,
                userID: fileData.userID,
                folderID: fileData.folderID,
                url: fileData.url,
            }
        })

        console.log("File uploaded to DB");
        console.log(file);
    } catch (error) {
        throw new Error(error);
    }
}

// returns all files that have been uploaded
async function getAllFiles() {
    const allFiles = await prisma.file.findMany();

    return allFiles;
}

// returns all users files by users ID
async function getAllFilesByUserID(userID) {
    const userFiles = await prisma.file.findMany({
        where: {
            userID: userID
        },
        include: {
            folder: true
        }
    });

    return userFiles;
}

// returns a file by id
async function getFileData(fileID) {
    try {
        const file = await prisma.file.findUnique({
            where: {
                id: fileID,
            }
        })

        return file;
    } catch (error) {
        throw new Error(error);
    }
}

// return path to the file
async function getFilePath(fileID) {
    const { path } = await prisma.file.findUnique({
        where: {
            id: fileID
        }
    })

    return path;
}

// update file data
async function updateFileData(userID, file) {
    try {
        const updatedFile = await prisma.file.update({
            where: {
                id: file.id,
                userID: userID
            },
            data: {
                name: file.name,
                path: file.path
            }
        })

        return updatedFile;
    } catch (error) {
        console.error(error);
    }
}

// delete file
async function deleteFile(userID, folderID) {
    try {
        const deletedFile = await prisma.file.delete({
            where: {
                id: folderID,
                userID: userID
            }
        })

        console.log(`Deleted file: ${deletedFile.name} (ID: ${deletedFile.id})`);
    } catch (error) {
        console.error(error);
    }
}

/*
        ===== FOLDERS =====
*/

// inserts new folder data into DB
async function createFolder(folderData) {
    const folder = await prisma.folder.create({
        data: {
            name: folderData.name,
            created: folderData.created,
            userID: folderData.userID,
            path: folderData.path,
            parentID: folderData.parentID,
        }
    })

    return folder;
}

// returns all users folders by userID
async function getFoldersByUserID(userID) {
    const folders = await prisma.folder.findMany({
        where: {
            userID: userID
        }
    });

    return folders;
}

// returns folder data by folder id
async function getFolderData(userID, folderID) {
    const folder = await prisma.folder.findUnique({
        where: {
            id: folderID,
            userID: userID,
        },
        include: {
            File: true
        }
    });

    return folder;
}

// returns folders and files within a specific folder, null = root folder
async function getFolderContent(userID, parentID = null) {
    // fetching subfolders
    const folders = await prisma.folder.findMany({
        where: {
            userID: userID,
            parentID: parentID // null = root subfolders
        }
    });

    // fetching files in the folder
    const files = await prisma.file.findMany({
        where: {
            userID: userID,
            folderID: parentID // null = root files
        }
    });

    return { folders, files };
}

// update folder name
async function updateFolder(userID, folder) {
    try {
        const updatedFolder = await prisma.folder.update({
            where: {
                id: folder.id,
                userID: userID
            },
            data: {
                name: folder.name,
                path: folder.path
            }
        });

        return updatedFolder; // returns updated data if successfully updated
    } catch (error) {
        throw new Error(error);
    }
}

// delete folder and its files
async function deleteFolderAndFiles(userID, folderID) {
    // delete files in folder
    try {
        const deletedFiles = await prisma.file.deleteMany({
            where: {
                folderID: folderID,
                userID: userID
            }
        })

        console.log(`Number of deleted files: ${deletedFiles.count}`);
    } catch (error) {
        console.error(error);
    }

    // delete folder
    try {
        const deletedFolder = await prisma.folder.delete({
            where: {
                id: folderID,
                userID: userID
            }
        })

        console.log(`Deleted folder: ${deletedFolder.name} (ID: ${deletedFolder.id})`);
    } catch (error) {
        console.error(error);
    }
}

export default {
    createUser,
    findUserByUsername,
    findUserById,
    usernameExists,
    emailExists,
    insertFile,
    getAllFiles,
    getAllFilesByUserID,
    getFileData,
    getFilePath,
    updateFileData,
    deleteFile,
    createFolder,
    getFoldersByUserID,
    getFolderData,
    getFolderContent,
    updateFolder,
    deleteFolderAndFiles,
}