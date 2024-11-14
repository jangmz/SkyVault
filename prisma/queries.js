import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createUser(user) {
    try {
        const userData = await prisma.user.create({
            data: {
                username: user.username,
                password: user.password1,
                email: user.email
            }
        })
        console.log("User added.");
        console.log(userData);
    } catch (error) {
        console.error(error);
    }
}

export default {
    createUser,
}