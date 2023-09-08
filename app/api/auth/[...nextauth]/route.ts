import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "manolito" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        console.log("CRED", credentials?.username);
        const userFound = await User.findOne({
          username: credentials?.username,
        }).select("+password");

        console.log("authorizing ", userFound?.username);

        if (!userFound) throw new Error("Cannot find username");

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          userFound.password
        );

        if (!passwordMatch) throw new Error("Invalid credentials");

        console.log(userFound);

        return userFound;
      },
    }),
  ],
  pages: {
    signIn: "/dashboard",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user as any;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
