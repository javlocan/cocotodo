"use client";

import { Project } from "types";

import styles from "./ProjectCard.module.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const deleteProject = async (id: string) => {
  const res = await fetch(`/api/projects?id=${id}`, {
    method: "DELETE",
  });
  return res.json();
};

export const ProjectCard = ({ project }: { project: Project }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const handleDelete = async () => {
    await deleteProject(project._id);
    router.refresh();
  };
  const openProject = async () => {
    router.push(`/project/${session?.user?._id}/${project._id}`);
  };

  return (
    <div
      className={styles.card}
      style={{
        backgroundColor: project.settings?.color || "rgba(180,180,180)",
      }}
    >
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
    </div>
  );
};
