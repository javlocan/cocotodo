import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";

import User from "@/models/user";
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

  if (!foundUserInfo)
    return NextResponse.json(
      { error: "A weird error ocurred. Contact the web admin." },
      { status: 400 }
    );

  if (foundUserInfo.groups.length) {
    await foundUserInfo.populate(["groups"]);
  }
  if (foundUserInfo.projects.length) {
    await foundUserInfo.populate(["projects"]);
  }
  return NextResponse.json(foundUserInfo, { status: 200 });
}
