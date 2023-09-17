import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/project";
import { NextApiRequest, NextApiResponseServerIo } from "next";
import dayjs from "dayjs";
export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    connectDB();
    const projectId = req.query.id;
    const project = await Project.findById(projectId);

    const lastUpdateClient = req.query.lastUpdate; // same format... sad
    const lastUpdateServer = dayjs(project.updatedAt).format("YYYYMMDDHHmmssSSS");

    const channelKey = `updateProject:${projectId}`;

    res?.socket?.server?.io?.emit(channelKey, {
      lastUpdateClient,
      lastUpdateServer,
    });
    res.flushHeaders();
    return res.json({ lastUpdateClient, lastUpdateServer });
  } catch (err) {
    console.log("PROJECT SOCKET ERROR", err);
    return res.status(500).json({ message: "fkn sockets" });
  }
}
