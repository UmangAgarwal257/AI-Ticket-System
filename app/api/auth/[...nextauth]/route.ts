import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createOrUpdateUser } from "@/lib/controllers/user";
import { prismaClient } from "@/lib/db";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    callbacks: {
        async signIn({ user, account}) {
            if (account?.provider === "google" && user.email) {
                try {
                    await createOrUpdateUser(user.email);
                    return true;
                } catch (error) {
                    console.error("Error during sign in:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                const dbUser = await prismaClient.user.findUnique({
                    where: { email: user.email! }
                });
                if (dbUser) {
                    token.role = dbUser.role;
                    token.id = dbUser.id;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    role: token.role as string,
                    id: token.id as string
                } as typeof session.user & { role: string; id: string };
            }
            return session;
        },
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };