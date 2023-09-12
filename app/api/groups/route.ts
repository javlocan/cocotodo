import { connectDB } from "@/libs/mongodb";
import Group from "@/models/group";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/user";
/* export async function GET(req: NextRequest) {
  const urlSearchParams = new URLSearchParams(req.nextUrl.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const objectId = new mongoose.Types.ObjectId(params.id);
  connectDB();

  const foundGroups = await Group.find({ ownerId: objectId });
  if (!foundGroups)
    return NextResponse.json(
      { error: "You don't have groups" },
      { status: 400 }
    );
  return NextResponse.json(foundGroups, { status: 200 });
} */

export async function POST(req: NextRequest) {
  const newGroup = await req.json();
  connectDB();
  const foundGroup = await Group.findOne({ name: newGroup.name });

  if (foundGroup) {
    return NextResponse.json({ error: "Group name is taken" }, { status: 400 });
  }
  newGroup.settings = { color: `hsl(${Math.random() * 360} 45% 45%)` };
  const group = await Group.create(newGroup);
  group.save();

  await User.findByIdAndUpdate(group.ownerId, {
    $push: { groups: group._id },
  });

  return NextResponse.json({ group }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const urlSearchParams = new URLSearchParams(req.nextUrl.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  connectDB();

  const foundGroup = await Group.findByIdAndRemove(params.id);

  foundGroup.members.forEach(async (member: any) => {
    await User.findByIdAndUpdate(member, {
      $pull: { groups: params.id },
    });
  });

  return NextResponse.json(
    { message: `Group "${foundGroup.name}" has been deleted` },
    { status: 200 }
  );
}
