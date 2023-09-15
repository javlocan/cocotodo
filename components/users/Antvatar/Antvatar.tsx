import { Avatar } from "antd";
import React from "react";
import { User } from "types";

export const Antvatar = React.memo(function Ale({ user }: { user: User }) {
  let name = user?.displayname || user?.username || "Lucy";
  if (name.length > 4) name = name.substring(0, 4);
  if (user?.image) return <Avatar src={user.image} size="large" gap={4} />;
  return (
    <Avatar
      style={{
        backgroundColor: `hsl(${Math.random() * 360} 45% 45%)`,
        verticalAlign: "middle",
      }}
      size="default"
      gap={4}
    >
      {name}
    </Avatar>
  );
});
