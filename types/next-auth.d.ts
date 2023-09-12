import { DefaultUser } from "next-auth";
declare module "next-auth" {
  interface Session {
    user?: SessionUser; // & { username: string; _id: Schema.Types.ObjectId };
  }
  interface DefaultUser {
    _id: Schema.Types.ObjectId;
  }
  interface User extends DefaultUser {
    username: string;
    displayname: string;
  }

  interface SessionUser {
    displayname: string;
    username: string;
    image?: string;
    _id: Schema.Types.ObjectId;
    email: string;
  }
}
