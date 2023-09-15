"use client";

import { AnimatePresence, LayoutGroup } from "framer-motion";
import styles from "./GroupPanel.module.css";
import { Group, Project } from "types";
import { GroupCard } from "../GroupCard/GroupCard";
import dayjs from "dayjs";
export const GroupPanel = ({ userInfo }: { userInfo: any }) => {
  const groups = userInfo.groups.sort((prev: Project, post: Project) => {
    const a: any = parseInt(dayjs(prev.updatedAt).format("YYYYMMDDHHmmss"));
    const b: any = parseInt(dayjs(post.updatedAt).format("YYYYMMDDHHmmss"));
    return a > b ? -1 : 1;
  });

  return (
    <>
      <h2>Grupos</h2>

      <div className={styles.panel__list}>
        <LayoutGroup>
          <AnimatePresence>
            {groups.map((group: Group, i: number) => (
              <GroupCard group={group} key={group._id} stagger={i * 0.1} />
            ))}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </>
  );
};
