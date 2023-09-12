"use client";

import { Group } from "types";

import styles from "./GroupCard.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const deleteGroup = async (id: string) => {
  const res = await fetch(`/api/groups?id=${id}`, {
    method: "DELETE",
  });
  return res.json();
};
export const GroupCard = ({ group }: { group: Group }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const handleDelete = async () => {
    await deleteGroup(group._id);
    router.refresh();
  };

  return (
    <div
      className={styles.card}
      style={{ backgroundColor: group.settings?.color || "rgba(180,180,180)" }}
    >
      <h3 className={styles.name}>{group.name}</h3>
      <p className={styles.description}>{group.description}</p>
      <span className={styles.members}>{group.members.length} members</span>
      {session?.user?._id === group.ownerId && (
        <button onClick={handleDelete}>DELETE</button>
      )}
    </div>
  );
};
