import { TodoCard } from "@/components/todos/TodoCard/TodoCard";

import { redirect } from "next/navigation";
import { Todo } from "types";

import styles from "./page.module.css";
import { NewTodo } from "@/components/todos/NewTodo/NewTodo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
  const [ownerId, projectId] = params.slug;

  if (!ownerId || !projectId) redirect("/dashboard");
  if (!session) redirect("/");
  const project = await getProject(ownerId, projectId);

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
      <section className={styles.todos}>
        {project.todos?.map((todo: Todo) => (
          <TodoCard key={todo._id} todo={todo} projectId={projectId} />
        ))}
        <NewTodo projectId={projectId} />
      </section>
    </main>
  );
}
