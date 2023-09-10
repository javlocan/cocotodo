declare module "types" {
  interface Group {
    _id: string;
    name: string;
    description: string;
    members: string[];
    settings: { color?: string; image?: string };
  }
}

module.exports = "types";
