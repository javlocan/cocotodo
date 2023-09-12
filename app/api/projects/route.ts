import { connectDB } from "@/libs/mongodb";
import Project from "@/models/project";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/user";
import Todo from "@/models/todo";
export async function GET(req: NextRequest) {
  const urlSearchParams = new URLSearchParams(req.nextUrl.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const objectId = new mongoose.Types.ObjectId(params.id);

  connectDB();
  const foundProjects = await Project.find({ ownerId: objectId });
  if (!foundProjects)
    return NextResponse.json(
      { error: "You don't have Projects" },
      { status: 400 }
    );
  return NextResponse.json(foundProjects, { status: 200 });
}
export async function POST(req: NextRequest) {
  const newProject = await req.json();
  connectDB();
  const foundProject = await Project.findOne({ name: newProject.name });

  if (foundProject) {
    return NextResponse.json(
      { error: "Project name is taken" },
      { status: 400 }
    );
  }

  newProject.settings = { color: `hsl(${Math.random() * 360} 45% 45%)` };
  const project = await Project.create(newProject);

  const todo = new Todo({
    title: "A simple todo",
    content: "with some content",
    creatorId: project.ownerId,
  });
  project.todos.push(todo);

  await project.save();

  await User.findByIdAndUpdate(project.ownerId, {
    $push: { projects: project },
  });

  return NextResponse.json({ project }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const urlSearchParams = new URLSearchParams(req.nextUrl.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  connectDB();

  const foundProject = await Project.findByIdAndRemove(params.id);

  foundProject.participants.forEach(async (member: any) => {
    await User.findByIdAndUpdate(member, {
      $pull: { projects: params.id },
    });
  });

  return NextResponse.json(
    { message: `Project "${foundProject.name}" has been deleted` },
    { status: 200 }
  );
}