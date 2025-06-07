import { prismaClient } from "@/lib/db";
import { inngest } from "@/lib/inngest";

export const createOrUpdateUser = async (email: string) => {
    try {
        const existingUser = await prismaClient.user.findUnique({
            where: { email }
        });

        const user = await prismaClient.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                role: "USER",
                skills: [],
            }
        });

        if (!existingUser) {
            await inngest.send({
                name: "user/signup",
                data: { email }
            });
        }

        return user;
    } catch (error) {
        console.error("Create user error:", error);
        throw error;
    }
};

export const updateUser = async (userId: string, data: { skills?: string[], role?: "USER" | "MODERATOR" | "ADMIN" }, userRole: string) => {
    try {
        if (userRole !== "ADMIN") {
            throw new Error("Forbidden");
        }
        
        return await prismaClient.user.update({
            where: { id: userId },
            data
        });
    } catch (error) {
        console.error("Update user error:", error);
        throw error;
    }
};

export const getUsers = async (userRole: string) => {
    try {
        if (userRole !== "ADMIN") {
            throw new Error("Forbidden");
        }

        return await prismaClient.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                skills: true,
                createdAt: true
            }
        });
    } catch (error) {
        console.error("Get users error:", error);
        throw error;
    }
};
