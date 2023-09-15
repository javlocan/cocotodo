"use client";

import { useSocket } from "@/libs/SocketProvider/SocketProvider";
import { FloatButton } from "antd";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  if (!isConnected) {
    return <FloatButton type="primary" description="1s"></FloatButton>;
  }

  return <FloatButton type="primary" description="LIVE"></FloatButton>;
};
