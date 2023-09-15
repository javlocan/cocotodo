"use client";

import { AnimatePresence, LayoutGroup } from "framer-motion";
import styles from "./ProjectPanel.module.css";
import { Project } from "types";
import { ProjectCard } from "../ProjectCard/ProjectCard";
import dayjs from "dayjs";
export const ProjectPanel = ({ userInfo }: { userInfo: any }) => {
  const projects = userInfo.projects.sort((prev: Project, post: Project) => {
    const a: any = parseInt(dayjs(prev.updatedAt).format("YYYYMMDDHHmmss"));
    const b: any = parseInt(dayjs(post.updatedAt).format("YYYYMMDDHHmmss"));
    return a > b ? -1 : 1;
  });

  return (
    <>
      <h2>Proyectos</h2>

      <div className={styles.panel__list}>
        <LayoutGroup>
          <AnimatePresence>
            {projects.map((project: Project, i: number) => (
              <ProjectCard
                project={project}
                key={project._id}
                stagger={i * 0.1}
              />
            ))}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </>
  );
};
