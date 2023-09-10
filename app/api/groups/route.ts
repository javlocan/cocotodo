import { connectDB } from "@/libs/mongodb";
import Group from "@/models/group";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
export async function GET(req: NextRequest) {
  const query = req.nextUrl.search.slice(1);
  const objectId = new mongoose.Types.ObjectId(query);
  connectDB();
  const foundGroups = await Group.find({ ownerId: objectId });
  if (!foundGroups)
    return NextResponse.json(
      { error: "You don't have groups" },
      { status: 400 }
    );
  return NextResponse.json(foundGroups, { status: 200 });
}
export async function POST(req: NextRequest) {
  const newGroup = await req.json();
  connectDB();
  const foundGroup = await Group.findOne({ name: newGroup.name });

  if (foundGroup) {
    return NextResponse.json({ error: "Group name is taken" }, { status: 400 });
  }
  newGroup.settings = { color: `hsl(${Math.random() * 360} 45% 45%)` };
  console.log(newGroup);
  const group = await Group.create(newGroup);
  group.save();

  return NextResponse.json({ group }, { status: 200 });
}
