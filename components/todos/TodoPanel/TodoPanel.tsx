import { TodoCard } from "@/components/todos/TodoCard/TodoCard";

import { redirect } from "next/navigation";
import { Todo } from "types";

import styles from "./TodoPanel.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dayjs from "dayjs/esm";
async function getProject(ownerId: string, projectId: string) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/todos?ownerId=${ownerId}&projectId=${projectId}`,
    { method: "GET" }
  );
  return await res.json();
}
export const TodoPanel = async ({
  params,
}: {
  params: { slug: Array<string> };
}) => {
  const session = await getServerSession(authOptions);
  const [ownerId, projectId] = params.slug;

  if (!ownerId || !projectId) redirect("/dashboard");
  if (!session) redirect("/");
  const project = await getProject(ownerId, projectId);

  const todos = project.todos.sort((prev: Todo, post: Todo) => {
    const a: any = parseInt(dayjs(prev.deadline).format("YYYYMMDD")) || null;
    const b: any = parseInt(dayjs(post.deadline).format("YYYYMMDD")) || null;
    if (a === "" || a === null) return 1;
    if (b === "" || b === null) return -1;
    if (a === b) return 0;
    return a < b ? -1 : 1;
  });

  return (
    <section className={styles.todos__container}>
      {todos?.map((todo: Todo, i: number) => {
        const isSameDayAsTomorrow = dayjs(todo.deadline).isSame(
          todos[i + 1]?.deadline,
          "day"
        );
        const isFirstNullDeadline =
          todo.deadline === null && todos[i - 1].deadline !== null;
        const deadline =
          todo.deadline &&
          !dayjs(todo.deadline).isSame(todos[i - 1]?.deadline, "day")
            ? dayjs(todo.deadline).format("dddDD")
            : "";
        const newmonth =
          todos[i + 1]?.deadline &&
          !dayjs(todo.deadline).isSame(todos[i + 1]?.deadline, "month")
            ? dayjs(todo.deadline).format("MMM")
            : "";
        return (
          <>
            {isFirstNullDeadline ? (
              <div className={`${styles.month} `}>Sin fecha</div>
            ) : null}
            {i === 0 ? (
              <div className={styles.month}>
                {dayjs(todo.deadline).format("MMMM")}
              </div>
            ) : null}
            <aside
              className={`${styles.deadline}  ${
                !isSameDayAsTomorrow ? styles.lastday : " "
              } ${todo.deadline === null ? styles.null : ""}`}
            >
              <span>{deadline}</span>
            </aside>
            <TodoCard key={todo._id} todo={todo} projectId={projectId} />
            {newmonth ? <div className={styles.month}>{newmonth}</div> : null}
          </>
        );
      })}
    </section>
  );
};
