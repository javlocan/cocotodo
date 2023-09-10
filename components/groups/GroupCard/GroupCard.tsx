import { Group } from "types";

import styles from "./GroupCard.module.css";
export const GroupCard = ({ group }: { group: Group }) => {
  return (
    <div
      className={styles.card}
      style={{ backgroundColor: group.settings?.color || "rgba(180,180,180)" }}
    >
      <h3 className={styles.name}>{group.name}</h3>
      <p className={styles.description}>{group.description}</p>
      <span className={styles.members}>{group.members.length} members</span>
    </div>
  );
};
