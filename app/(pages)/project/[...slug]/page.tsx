import { redirect } from "next/navigation";

import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TodoPanel } from "@/components/todos/TodoPanel/TodoPanel";
import { NewTodo } from "@/components/todos/NewTodo/NewTodo";
async function getProject(ownerId: string, projectId: string) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/todos?ownerId=${ownerId}&projectId=${projectId}`,
    { method: "GET" }
  );
  return await res.json();
}
export default async function TodosPage({
  params,
}: {
  params: { slug: Array<string> };
}) {
  const session = await getServerSession(authOptions);

  // Data, session and url handling here -------------

  const [ownerId, projectId] = params.slug;

  if (!ownerId || !projectId) redirect("/dashboard");
  if (!session) redirect("/");
  console.log(session);
  const project = await getProject(ownerId, projectId);

  // The main GRID for the SPA ------------------------

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.title}>
          <h1>{project.name}</h1>
          <h2>{project.ownerId.displayname}</h2>
        </div>
        <div className={styles.participants}>
          {project.participants.map((participant: any) => (
            <div key={participant._id}>{participant.displayname}</div>
          ))}
        </div>
      </header>
      <TodoPanel params={params} />
      <div style={{ gridColumn: "span 2" }}>
        <NewTodo projectId={projectId} />
      </div>
    </main>
  );
}
