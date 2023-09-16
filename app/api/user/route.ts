import mongoose, { model, models } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/user";

// ---------------- NO TOCAR --------------------
import { GroupSchema } from "@/models/group";
import { ProjectSchema } from "@/models/project";
const Group = models.Group || model("Group", GroupSchema);
const Project = models.Project || model("Project", ProjectSchema);
// ---------------- NO TOCAR --------------------

export async function GET(req: NextRequest) {
  const urlSearchParams = new URLSearchParams(req.nextUrl.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const objectId = new mongoose.Types.ObjectId(params.id);

  if (!objectId)
    return NextResponse.json(
      { error: "Weird error. If it persists, contact the web admin." },
      { status: 400 }
    );

  connectDB();

  const foundUserInfo = await User.findById(objectId).select(
    "+groups +projects -username -email"
  );

  await foundUserInfo.populate(["groups"]);

  // if (foundUserInfo.projects.length > 0) {
  await foundUserInfo.populate(["projects"]);
  //}
  return NextResponse.json(foundUserInfo, { status: 200 });
}
