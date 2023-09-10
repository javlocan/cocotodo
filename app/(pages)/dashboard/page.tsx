import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import styles from "./page.module.css";
import { NewGroupForm } from "@/components/groups/NewGroupForm/NewGroupForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GroupCard } from "@/components/groups/GroupCard/GroupCard";
import { Group } from "types";
async function getMyGroups(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/groups?${id}`, {
    method: "GET",
  });
  return await res.json();
}
export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const myGroups = await getMyGroups(session?.user?._id);
  return (
    <main className={styles.main}>
      <h1>Dashboard</h1>
      <section className={styles.groups__container}>
        <h2>Grupos</h2>
        <div className={styles.groups__list}>
          {!myGroups.error ? (
            myGroups.map((group: Group) => (
              <GroupCard group={group} key={group._id} />
            ))
          ) : (
            <div>{myGroups.error}</div>
          )}
        </div>
        <NewGroupForm />
      </section>
    </main>
  );
}
