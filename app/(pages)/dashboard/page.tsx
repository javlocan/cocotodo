import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import styles from "./page.module.css";
import { NewGroupForm } from "@/components/groups/NewGroupForm/NewGroupForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GroupCard } from "@/components/groups/GroupCard/GroupCard";
import { Group, Project } from "types";
import { ProjectCard } from "@/components/projects/ProjectCard/ProjectCard";
import { NewProjectForm } from "@/components/projects/NewProjectForm/NewProjectForm";

async function getUserInfo(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user?id=${id}`, {
    method: "GET",
  });
  return await res.json();
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const userInfo = await getUserInfo(session?.user?._id);
  return (
    <main className={styles.main}>
      <section className={styles.groups__container}>
        <h2>Proyectos</h2>
        <div className={styles.groups__list}>
          {userInfo.projects.length > 0 ? (
            userInfo.projects.map((project: Project) => (
              <ProjectCard project={project} key={project._id} />
            ))
          ) : (
            <div>{userInfo.error}</div>
          )}
        </div>
        <NewProjectForm />
      </section>
      <section className={styles.groups__container}>
        <h2>Grupos</h2>
        <div className={styles.groups__list}>
          {userInfo.groups.length > 0 ? (
            userInfo?.groups?.map((group: Group) => (
              <GroupCard group={group} key={group._id} />
            ))
          ) : (
            <div>{userInfo.error}</div>
          )}
        </div>
        <NewGroupForm />
      </section>
    </main>
  );
}
