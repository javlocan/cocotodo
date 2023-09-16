import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Project } from "@/models/project";
import { Todo } from "@/models/todo";

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

          const project = new Project({
            name: "Mi primer proyecto",
            description:
              "Creado de forma predeterminada para empezar a explorar ",
            ownerId: user._id,
            participants: [user._id],
          });

          const todo = new Todo({
            title: "Mi primera tarea",
            content: "Creada de forma predeterminada para empezar a explorar ",
            creatorId: user._id,
          });

          project.todos.push(todo);

          user.displayname = user.username;
          user.projects = [project._id];

          const savedUser = await user.save();
          await project.save();
          return savedUser;
        }

        // --------- REGISTRATION END ------------ //

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
        token.displayname = user.displayname;
        token.username = user.username;
        delete Object.assign(token, { image: token.picture }).picture;
        delete Object.assign(token, { _id: token.sub }).sub;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        displayname: token.displayname as string,
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
