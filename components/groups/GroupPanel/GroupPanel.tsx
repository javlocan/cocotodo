"use client";

import { AnimatePresence, LayoutGroup } from "framer-motion";
import styles from "./GroupPanel.module.css";
import { Group, Project } from "types";
import { GroupCard } from "../GroupCard/GroupCard";
import dayjs from "dayjs";
export const GroupPanel = ({ userInfo }: { userInfo: any }) => {
  const groups = userInfo.groups.sort((prev: Project, post: Project) => {
    const a: any = parseInt(dayjs(prev.updatedAt).format("YYYYMMDDHHmmssSSS"));
    const b: any = parseInt(dayjs(post.updatedAt).format("YYYYMMDDHHmmssSSS"));
    return a > b ? -1 : 1;
  });

  return (
    <div className={styles.panel__list}>
      <LayoutGroup>
        <AnimatePresence>
          {groups.map((group: Group, i: number) => (
            <GroupCard group={group} key={group._id} stagger={i * 0.1} />
          ))}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
};
