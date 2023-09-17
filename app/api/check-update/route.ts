import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/project";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlSearchParams = new URLSearchParams(req.nextUrl.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  connectDB();
  const projectId = params.projectId;
  const project = await Project.findById(projectId);
  console.log(params);
  const lastUpdateClient = params.lastUpdate; // same format... sad
  const lastUpdateServer = dayjs(project.updatedAt).format("YYYYMMDDHHmmssSSS");

  const reRender = lastUpdateClient < lastUpdateServer;

  if (reRender)
    return NextResponse.json({ message: "Someone's done something", reRender }, { status: 200 });
  else {
    return NextResponse.json({ message: "Chill" }, { status: 200 });
  }
}
