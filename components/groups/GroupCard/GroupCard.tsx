"use client";

import { Group } from "types";

import styles from "./GroupCard.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Spin } from "antd";
import { useState } from "react";

const deleteGroup = async (id: string) => {
  const res = await fetch(`/api/groups?id=${id}`, {
    method: "DELETE",
  });
  return res.json();
};
export const GroupCard = ({ group }: { group: Group }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteGroup(group._id);
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{
        opacity: 1,
        y: 0,
        type: "Spring",
        transition: { duration: 0.5 },
      }}
      exit={{ opacity: 0, scale: 0.2, transition: { duration: 0.3 } }}
      layout
      className={styles.card__container}
      style={{ backgroundColor: group.settings?.color || "rgba(180,180,180)" }}
    >
      <Spin spinning={isLoading} style={{ color: "black" }}>
        <article className={styles.card}>
          <h3 className={styles.name}>{group.name}</h3>
          <p className={styles.description}>{group.description}</p>
          <span className={styles.members}>{group.members.length} members</span>
          {session?.user?._id === group.ownerId && (
            <button onClick={handleDelete}>DELETE</button>
          )}
        </article>
      </Spin>
    </motion.div>
  );
};
