"use client";

import { useSocket } from "@/lib/SocketProvider/SocketProvider";
import { FloatButton } from "antd";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  if (!isConnected) {
    return (
      <FloatButton type="primary" description="1s" shape="square"></FloatButton>
    );
  }

  return (
    <FloatButton type="primary" description="LIVE" shape="square"></FloatButton>
  );
};
