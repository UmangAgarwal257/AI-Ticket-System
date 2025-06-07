import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prismaClient } from "@/lib/db";

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);

    if(!session?.user?.email) {
        return null;
    }

    const user = await prismaClient.user.findUnique({
        where : {email: session.user.email},
    })
    return user;
}

export async function requireAuth() {
    const user = await getCurrentUser();

    if(!user) {
        throw new Error("Unauthorized");
    }

    return user;
}

export async function requireAdmin() {
    const user = await requireAuth();

    if(user.role !== "ADMIN") {
        throw new Error("Forbidden");
    }

    return user;
}

export async function requireModerator() {
    const user = await requireAuth();

    if(!["ADMIN", "MODERATOR"].includes(user.role)) {
        throw new Error("Forbidden");
    }

    return user;
}