"use client";

import { TodoCard } from "@/components/todos/TodoCard/TodoCard";
import { Project, Todo } from "types";
import styles from "./TodoPanel.module.css";
import dayjs from "dayjs/esm";
import { Suspense, useCallback, useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Session } from "next-auth";
import { NewTodo } from "../NewTodo/NewTodo";
import { Participants } from "@/components/users/Antvatar/Participants";
import { Antvatar } from "@/components/users/Antvatar/Antvatar";
import { Divider, Spin } from "antd";

export const TodoPanel = ({ session, params }: { session: Session; params: Array<string> }) => {
  const [ownerId, projectId] = params;

  const [project, setProject] = useState<Project>({} as Project);

  //const lastUpdate = dayjs(project.updatedAt).format("YYYYMMDDHHmmssSSS");
  const getProject = useCallback(async () => {
    const res = await fetch(`/api/todos?ownerId=${ownerId}&projectId=${projectId}`, {
      method: "GET",
    });

    const result = await res.json();
    if (!result.error) {
      result.todos = superSort(result.todos);
      setProject(result);
    }
  }, [ownerId, projectId]);

  useEffect(() => {
    getProject();
  }, [getProject]);

  if (!project.participants)
    return (
      <Spin size="large" tip="Cargando proyecto" spinning={!project.participants}>
        <div style={{ width: "100vw", height: "100vh" }} />
      </Spin>
    );

  // Month array for mapping
  const monthPositions: { month: string; pos: number }[] = [];

  superSort(project.todos).forEach((todo: Todo, i: number) => {
    const pos = i + 1;
    const month = todo.deadline ? dayjs(todo?.deadline).format("MMMM") : "";
    console.log(todo.deadline, month);
    if (i === 0) monthPositions.push({ month: month ? month : "S.F.", pos });
    else {
      if (!month && project.todos[i - 1]?.deadline)
        monthPositions.push({ month: "S.F.", pos: pos + 2 });
      if (i > 0 && todo?.deadline && month !== dayjs(project.todos[i - 1].deadline).format("MMMM"))
        monthPositions.push({ month, pos });
    }
  });

  return (
    <Suspense fallback={null}>
      <section className={styles.todos__container}>
        <LayoutGroup>
          <AnimatePresence>
            {project.todos?.map((todo: Todo, i: number) => {
              // Si mañana es el mismo dia, height cambia
              const isSameDayAsTomorrow = dayjs(todo.deadline).isSame(
                project.todos[i + 1]?.deadline,
                "day"
              );
              const deadline =
                i !== 0
                  ? todo.deadline &&
                    !dayjs(todo.deadline).isSame(project.todos[i - 1]?.deadline, "day")
                    ? dayjs(todo.deadline).format("dddDD")
                    : ""
                  : todo.deadline
                  ? dayjs(todo.deadline).format("dddDD")
                  : null;

              const renderObject = {
                isSameDayAsTomorrow,
                deadline,
              };
              return (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  getProject={getProject}
                  projectId={project._id}
                  stagger={i * 0.1}
                  renderObject={renderObject}
                />
              );
            })}
            {monthPositions.map((obj) => {
              return (
                <motion.span
                  key={obj.month}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    type: "Spring",
                    transition: { duration: 1 },
                  }}
                  exit={{ opacity: 0, y: 40, transition: { duration: 0.3 } }}
                  className={styles.month}
                  style={{
                    gridRow: `${obj.pos}/${obj.pos + 2}`,
                  }}
                >
                  {obj.month}
                </motion.span>
              );
            })}
          </AnimatePresence>
        </LayoutGroup>
      </section>
      <aside className={styles.inter__sections}></aside>
      <section className={styles.right__display}>
        <div style={{ position: "sticky", top: 0 }}>
          <header className={styles.header}>
            <div className={styles.title}>
              <h1>{project.name}</h1>
              <div className={styles.participants}>
                <div className={styles.owner}>
                  <Antvatar user={project?.participants[0]} size={24} />
                  <h2>{project?.participants[0].displayname || "algo"}</h2>
                </div>
                <Participants size={40}>
                  {project.participants?.map((participant: any) => (
                    <Antvatar key={participant._id} user={participant} size={40} />
                  ))}
                </Participants>
              </div>
            </div>
            <Divider style={{ margin: "1.5rem 0 0 0" }} />
          </header>

          <NewTodo projectId={projectId} getProject={getProject} />
        </div>
      </section>
    </Suspense>
  );
};

const superSort = (todos: Todo[]) =>
  todos.sort((prev: Todo, post: Todo) => {
    const a: any = parseInt(dayjs(prev.deadline).format("YYYYMMDDHHmmssSSS")) || null;
    const b: any = parseInt(dayjs(post.deadline).format("YYYYMMDDHHmmssSSS")) || null;
    if (a === "" || a === null) return 1;
    if (b === "" || b === null) return -1;
    if (a === b) return 0;
    return a < b ? -1 : 1;
  });
