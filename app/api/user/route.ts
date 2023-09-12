import mongoose, { model, models } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";

import { User } from "@/models/user";
import { GroupSchema } from "@/models/group";
export const Group = models.Group || model("Group", GroupSchema);

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

  //if (foundUserInfo.groups.length > 0) {
  await foundUserInfo.populate(["groups"]);
  //}
  // if (foundUserInfo.projects.length > 0) {
  await foundUserInfo.populate(["projects"]);
  //}
  return NextResponse.json(foundUserInfo, { status: 200 });
}
