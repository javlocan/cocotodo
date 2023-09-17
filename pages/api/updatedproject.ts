/* import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/project";
import dayjs from "dayjs";
import { NextApiRequest } from "next";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextApiRequest) {
  const encoder = new TextEncoder();
  connectDB();

  const projectId = req.query.id;
  const project = await Project.findById(projectId);

  const lastUpdateClient = req.query.lastUpdate; // same format... sad
  const lastUpdateServer = dayjs(project.updatedAt).format("YYYYMMDDHHmmssSSS");

  const reRender = lastUpdateClient !== lastUpdateServer ? "outdated" : "uptodate";

  const readable = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode("as"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
 */
