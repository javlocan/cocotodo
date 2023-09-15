import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { NewGroupForm } from "@/components/groups/NewGroupForm/NewGroupForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GroupCard } from "@/components/groups/GroupCard/GroupCard";
import { Group } from "types";
import { NewProjectForm } from "@/components/projects/NewProjectForm/NewProjectForm";
import { ProjectPanel } from "@/components/projects/ProjectPanel/ProjectPanel";
import { Divider } from "antd";
import { GroupPanel } from "@/components/groups/GroupPanel/GroupPanel";

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
      <section className={styles.panel__container}>
        <ProjectPanel userInfo={userInfo} />
        <GroupPanel userInfo={userInfo} />
      </section>
      <aside className={styles.inter__sections}></aside>
      <section className={styles.display__container}>
        <NewProjectForm groups={userInfo.groups} />
        <Divider />
        <NewGroupForm />
      </section>
    </main>
  );
}
