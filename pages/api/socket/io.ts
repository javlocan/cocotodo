import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponseServerIo } from "next";
import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      // @ts-ignore
      addTrailingSlash: false,
      cors: {
        origin: "*",
      },
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
