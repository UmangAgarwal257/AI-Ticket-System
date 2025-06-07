import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createOrUpdateUser } from "@/lib/controllers/user";

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
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };