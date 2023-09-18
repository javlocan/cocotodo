import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { NewGroupForm } from "@/components/groups/NewGroupForm/NewGroupForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { NewProjectForm } from "@/components/projects/NewProjectForm/NewProjectForm";
import { ProjectPanel } from "@/components/projects/ProjectPanel/ProjectPanel";
import { Collapse, CollapseProps, Divider } from "antd";
import { GroupPanel } from "@/components/groups/GroupPanel/GroupPanel";
import { Suspense } from "react";

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

  const Panels: CollapseProps["items"] = [
    {
      key: "1",
      label: "Proyectos",
      children: <ProjectPanel userInfo={userInfo} />,
    },
    {
      key: "2",
      label: "Grupos",
      children: <GroupPanel userInfo={userInfo} />,
    },
  ];
  return (
    <main className={styles.main}>
      <section className={styles.panel__container}>
        <Suspense>
          <Collapse accordion items={Panels} className={styles.collapse} defaultActiveKey="1" />
        </Suspense>
      </section>
      <aside className={styles.inter__sections}></aside>
      <section className={styles.display__container}>
        <div style={{ position: "sticky", top: "1rem", margin: "0 auto" }}>
          <NewProjectForm groups={userInfo.groups} />
          <Divider />
          <NewGroupForm />
        </div>
      </section>
    </main>
  );
}
