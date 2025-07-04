import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
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
          userId: user.userId,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            role: "Player", // default role
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
  await connectDB();

  const email = user?.email || token?.email;
  if (email) {
    const dbUser = await User.findOne({ email });
    if (dbUser) {
      token.userId = dbUser.userId;
      token.role = dbUser.role;
      token.email = dbUser.email; // ensure token retains email
    }
  }

  return token;
},


    async session({ session, token }) {
      // Attach custom fields to the session
      if (token?.userId) session.user.userId = token.userId as number;
      if (token?.role) session.user.role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };