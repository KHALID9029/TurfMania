import NextAuth, { NextAuthOptions } from "next-auth";
//import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        if (!credentials?.email || !credentials.password) throw new Error("Missing credentials");

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found");

        if (!user.password) throw new Error("Password login unavailable for this account");

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) throw new Error("Incorrect password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          userId: user.userId, // include your custom userId
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            role: "Player", // default for Google signups
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
    //   if (token?.sub) {
    //     const user = await User.findById(token.sub).lean();
    //     if (user) {
    //       session.user.id = user._id.toString();
    //       session.user.role = user.role;
    //       session.user.userId = user.userId;
    //     }
    // }
    const user = await User.findById(token.sub);
  session.user = user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
