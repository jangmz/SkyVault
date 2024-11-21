import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
                folderID: fileData.folderID
            }
        })

        console.log("File uploaded to DB");
        console.log(file);
    } catch (error) {
        console.error(error);
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

// inserts new folder data into DB
async function createFolder(folderData) {
    const folder = await prisma.folder.create({
        data: {
            name: folderData.name,
            created: folderData.created,
            userID: folderData.userID,
            path: folderData.path
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
async function getFolderData(folderID) {
    const folder = await prisma.folder.findUnique({
        where: {
            id: folderID
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

export default {
    createUser,
    findUserByUsername,
    findUserById,
    usernameExists,
    emailExists,
    insertFile,
    getAllFiles,
    getAllFilesByUserID,
    createFolder,
    getFoldersByUserID,
    getFolderData,
    getFolderContent
}