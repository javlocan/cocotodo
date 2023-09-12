declare module "types" {
  interface User {
    _id: string;
    username: string;
    displayname?: string;
    email: string;
    image?: string;
    groups: string[];
    projects: string[];
  }
  interface Group {
    _id: string;
    name: string;
    description: string;
    ownerId: string;
    members: string[];
    settings: { color?: string; image?: string };
  }
  interface Project {
    _id: string;
    name: string;
    ownerId: string;
    description: string;
    participants: string[];
    settings: { color?: string; image?: string };
  }
  interface Todo {
    _id: string;
    title: string;
    content: string;
    creatorId: string;
    deadline: string;
  }
}

module.exports = "types";
