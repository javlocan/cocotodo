import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TodoPanel } from "@/components/todos/TodoPanel/TodoPanel";
import { NewTodo } from "@/components/todos/NewTodo/NewTodo";
import { Antvatar } from "@/components/users/Antvatar/Antvatar";
import { Participants } from "@/components/users/Antvatar/Participants";

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

  const project = await getProject(ownerId, projectId);

  // The main GRID for the SPA ------------------------

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.title}>
          <h1>{project.name}</h1>

          <div className={styles.participants}>
            <div className={styles.owner}>
              <Antvatar user={project.participants[0]} />
              <h2>{project.ownerId.displayname}</h2>
            </div>
            <Participants>
              {project.participants.map((participant: any) => (
                <Antvatar key={participant._id} user={participant} />
              ))}
            </Participants>
          </div>
        </div>
      </header>
      <TodoPanel project={project} />
      <aside className={styles.inter__sections}></aside>
      <section className={styles.right__display}>
        <NewTodo projectId={projectId} />
      </section>
    </main>
  );
}
