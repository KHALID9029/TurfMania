import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import IUser from "@/models/User";


export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider(
            {
                name: "Credentials",
                credentials: {
                    email: {label: "Email", type: "text", placeholder: "Enter your email"},
                    password: {label: "Password", type: "password", placeholder: "Enter your password"}
                },
                async authorize(credentials){
                    
                }
            }
        )
    ]
}