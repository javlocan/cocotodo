"use client";

import { Project } from "types";
import styles from "./ProjectCard.module.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Spin } from "antd";

const deleteProject = async (id: string) => {
  const res = await fetch(`/api/projects?id=${id}`, {
    method: "DELETE",
  });
  return res.json();
};

export const ProjectCard = ({
  project,
  stagger,
}: {
  project: Project;
  stagger: number;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    await deleteProject(project._id);
    router.refresh();
  };
  const openProject = async () => {
    router.push(`/project/${session?.user?._id}/${project._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{
        opacity: 1,
        y: 0,
        type: "Spring",
        transition: { duration: 0.5, delay: stagger },
      }}
      exit={{ opacity: 0, scale: 0.2, transition: { duration: 0.3 } }}
      layout
      className={`${styles.card__container} projectcard`}
      style={{
        backgroundColor: project.settings?.color || "rgba(180,180,180)",
      }}
    >
      <Spin spinning={isLoading} style={{ color: "black" }}>
        <article className={styles.card}>
          <h3 className={styles.name}>{project.name}</h3>
          <p className={styles.description}>{project.description}</p>
          <span className={styles.participants}>
            {project.participants.length} ppl
          </span>
          {session?.user?._id === project.ownerId && (
            <button onClick={handleDelete}>DELETE</button>
          )}
          <button onClick={openProject} style={{ bottom: "35px" }}>
            OPEN
          </button>
        </article>
      </Spin>
    </motion.div>
  );
};
