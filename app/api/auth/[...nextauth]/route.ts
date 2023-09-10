import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "manolito" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await connectDB();
        const { username, password } = credentials as Record<string, string>;

        const userFound = await User.findOne({
          username,
        }).select("+password");

        // ---------- ONLY FOR REGISTRATION ----------- //

        if (req.query?.register === "true") {
          const email = req.query.email;
          if (userFound) throw new Error("Username already exists");
          const emailFound = await User.findOne({ email });
          if (emailFound) throw new Error("Email is already in use");

          const hashedPassword = await bcrypt.hash(password, 12);

          const user = new User({
            username,
            email,
            password: hashedPassword,
          });

          const savedUser = await user.save();
          return savedUser;
        }

        if (!userFound) throw new Error("Cannot find username");

        const passwordMatch = await bcrypt.compare(
          password,
          userFound.password
        );

        if (!passwordMatch) throw new Error("Invalid credentials");

        return userFound;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        delete Object.assign(token, { image: token.picture }).picture;
        delete Object.assign(token, { _id: token.sub }).sub;

        //token.name = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        username: token.username as string,
        image: token.image as string,
        email: token.email as string,
        _id: token._id,
      };
      return session;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
