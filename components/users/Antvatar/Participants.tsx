"use client";

import { Avatar } from "antd";

export const Participants = ({ children }: { children: React.ReactNode }) => {
  const randomAngle = Math.random() * 360;
  return (
    <Avatar.Group
      maxCount={2}
      maxStyle={{
        color: `hsl(${randomAngle} 35% 35%)`,
        backgroundColor: `hsl(${randomAngle} 85% 85%)`,
      }}
    >
      {children}
    </Avatar.Group>
  );
};
