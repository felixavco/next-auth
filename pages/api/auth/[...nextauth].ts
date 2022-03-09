import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
    ],
    theme: {
        colorScheme: "light",
    },
    callbacks: {
        async signIn({ account, profile }) {
            if (account.provider === "google") {
                try {
                    const user = await prisma.user.findUnique({ where: { email: profile.email } });
                    if (!user) {
                        return false;
                    }
                    return true;
                } catch (error) {
                    console.error('Google Auth fail!', error)
                    return false;
                } finally {
                    await prisma.$disconnect();
                }
            }
            return false
        },
    }
})