import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      userId?: number;
      name?: string | null;
      email?: string | null;
    };
  }
  
  interface User {
    id: string;
    role?: string;
    userId?: string;
  }
}
