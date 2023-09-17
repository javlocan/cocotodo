import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TodoPanel } from "@/components/todos/TodoPanel/TodoPanel";

async function getProject(ownerId: string, projectId: string) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/todos?ownerId=${ownerId}&projectId=${projectId}`,
    { method: "GET" }
  );
  return await res.json();
}

export default async function TodosPage({ params }: { params: { slug: Array<string> } }) {
  const session = await getServerSession(authOptions);

  // Data, session and url handling here -------------

  const [ownerId, projectId] = params.slug;

  if (!ownerId || !projectId) redirect("/dashboard");
  if (!session) redirect("/");

  // The main GRID for the SPA ------------------------

  return (
    <main className={styles.main}>
      <TodoPanel session={session} params={params.slug} />
    </main>
  );
}
