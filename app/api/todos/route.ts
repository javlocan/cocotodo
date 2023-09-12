import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { Project } from "@/models/project";
import { Todo } from "@/models/todo";
import { User } from "@/models/user";
export async function GET(req: NextRequest) {
  const urlSearchParams = new URLSearchParams(req.nextUrl.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  connectDB();

  const ownerId = new mongoose.Types.ObjectId(params.ownerId);
  const projectId = new mongoose.Types.ObjectId(params.projectId);

  const project = await Project.findById(projectId);

  if (!project)
    return NextResponse.json(
      { error: "The project does not exist" },
      { status: 400 }
    );
  if (!ownerId.equals(project.ownerId)) {
    return NextResponse.json(
      { error: "You don't have access to this project" },
      { status: 400 }
    );
  }

  await project.populate("participants", "displayname email image");
  await project.populate("ownerId", "displayname email image");

  return NextResponse.json(project, { status: 200 });
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, creatorId, content, deadline, projectId } = body;
  connectDB();
  const newTodo = new Todo({
    title,
    creatorId,
    content,
    deadline,
  });
  const update = await Project.findByIdAndUpdate(projectId, {
    $push: { todos: newTodo },
  });

  console.log(update);
  return NextResponse.json(
    { message: "Todo created successfully" },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest) {
  const urlSearchParams = new URLSearchParams(req.nextUrl.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const { todoId, projectId } = params;
  connectDB();
  const todo = await Project.findByIdAndUpdate(projectId, {
    $pull: { todos: { _id: todoId } },
  });
  if (!todo)
    return NextResponse.json({ error: "An error ocurred" }, { status: 400 });
  return NextResponse.json(
    { message: "Todo removed successfully" },
    { status: 200 }
  );
}
