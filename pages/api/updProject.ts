import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/project";
import dayjs from "dayjs";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.writeHead(200, {
    Connection: "keep-alive",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": `*`,
    "Content-Encoding": "none",
    "Cache-Control": "no-cache, no-transform",
    "Content-Type": "text/event-stream",
  });

  const interval = setInterval(async () => {
    mongoose.disconnect().then(async () => {
      connectDB();
    });

    const projectId = req.query.id;
    const project = await Project.findById(projectId);

    const lastUpdateClient = req.query.lastUpdate; // same format... sad
    const lastUpdateServer = dayjs(project.updatedAt).format("YYYYMMDDHHmmssSSS");

    const reRender = lastUpdateClient !== lastUpdateServer;
    console.log("Checking how this is going ", reRender, project);

    res.write(
      `data: ${JSON.stringify({
        message: reRender ? "Someone's done something" : "Chill",
        value: reRender,
      })}\n\n`
    );
  }, 3000);

  res.on("close", () => {
    console.log(`close `);
    clearInterval(interval);
    mongoose.disconnect();
    res.end();
  });

  res.socket?.on("close", () => {
    console.log(`close `);
    clearInterval(interval);
    mongoose.disconnect();
    res.end();
  });
};

export default handler;
