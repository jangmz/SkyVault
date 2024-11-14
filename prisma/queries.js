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

export default {
    createUser,
    usernameExists,
    emailExists,
}