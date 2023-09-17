"use client";
import { TodoCard } from "@/components/todos/TodoCard/TodoCard";
import { Project, Todo } from "types";
import styles from "./TodoPanel.module.css";
import dayjs from "dayjs/esm";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Session } from "next-auth";
import { NewTodo } from "../NewTodo/NewTodo";
import { Participants } from "@/components/users/Antvatar/Participants";
import { Antvatar } from "@/components/users/Antvatar/Antvatar";
import { Spin } from "antd";

export async function getProject(ownerId: string, projectId: string) {
  const res = await fetch(`/api/todos?ownerId=${ownerId}&projectId=${projectId}`, {
    method: "GET",
  });

  return await res.json();
}

export async function checkUpdates(projectId: string, lastUpdate: string) {
  const res = await fetch(`/api/check-update?projectId=${projectId}&lastUpdate=${lastUpdate}`, {
    method: "GET",
  });

  return await res.json();
}

export const TodoPanel = ({ session, params }: { session: Session; params: Array<string> }) => {
  const [ownerId, projectId] = params;
  const { user } = session;

  const [project, setProject] = useState<Project>({} as Project);
  const todoList: Todo[] = project.todos;

  useEffect(() => {
    getProject(user?._id as string, projectId).then((project) => {
      superSort(project.todos);
      setProject(project);
    });
  }, [ownerId, projectId, user?._id]);

  const lastUpdate = dayjs(project.updatedAt).format("YYYYMMDDHHmmssSSS");

  useEffect(() => {
    let interval = setInterval(() => {
      checkUpdates(projectId, lastUpdate).then((res) => {
        if (res.reRender) {
          getProject(user?._id as string, projectId).then((project) => {
            superSort(project.todos);
            setProject(project);
          });
          clearInterval(interval);
        }
      });
    }, 2000);
  }, [lastUpdate, projectId, user?._id]);
  /* 
  useEffect(() => {
    const eventSource = new EventSource(
      `/api/updProject?id=${projectId}&lastUpdate=${lastUpdate}`,
      {
        withCredentials: true,
      }
    );
    eventSource.onopen = () => {
      console.log("open");
    };
    eventSource.onmessage = (e) => {
      const res = JSON.parse(e.data);
      if (res.value === true) {
        getProject(user?._id as string, projectId).then((project) => {
          superSort(project.todos);
          setProject(project);
        });
      }
    };
    eventSource.onerror = (e) => {
      console.log(e);
    };

    return () => {
      eventSource.close();
    };
  }, [lastUpdate, projectId, user?._id]); */

  if (!project.participants)
    return (
      <Spin size="large" tip="Cargando proyecto">
        <div style={{ width: "100vw", height: "100vh" }} />
      </Spin>
    );

  // Month array for mapping
  const monthPositions: { month: string; pos: number }[] = [];

  todoList.forEach((todo: Todo, i: number) => {
    const pos = i + 1;
    const month = dayjs(todo.deadline).format("MMMM");
    if (i === 0) monthPositions.push({ month, pos });
    if (i > 0 && todo.deadline && month !== dayjs(project.todos[i - 1].deadline).format("MMMM"))
      monthPositions.push({ month, pos });
    if (!todo.deadline && todoList[i - 1].deadline) monthPositions.push({ month: "S.F.", pos });
  });

  return (
    <Suspense fallback={<Spin />}>
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
      </header>
      <section className={styles.todos__container}>
        <LayoutGroup>
          <AnimatePresence>
            {todoList?.map((todo: Todo, i: number) => {
              // Si mañana es el mismo dia, height cambia
              const isSameDayAsTomorrow = dayjs(todo.deadline).isSame(
                todoList[i + 1]?.deadline,
                "day"
              );
              const deadline =
                i !== 0
                  ? todo.deadline && !dayjs(todo.deadline).isSame(todoList[i - 1]?.deadline, "day")
                    ? dayjs(todo.deadline).format("dddDD")
                    : ""
                  : dayjs(todo.deadline).format("dddDD");

              const renderObject = {
                isSameDayAsTomorrow,
                deadline,
              };
              return (
                <TodoCard
                  key={todo._id}
                  todo={todo}
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
                    gridRow: `${obj.pos}/${obj.pos === 1 ? obj.pos + 1 : obj.pos + 2}`,
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
        <NewTodo projectId={projectId} />
      </section>
    </Suspense>
  );
};

export const superSort = (todos: Todo[]) =>
  todos.sort((prev: Todo, post: Todo) => {
    const a: any = parseInt(dayjs(prev.deadline).format("YYYYMMDDHHmmssSSS")) || null;
    const b: any = parseInt(dayjs(post.deadline).format("YYYYMMDDHHmmssSSS")) || null;
    if (a === "" || a === null) return 1;
    if (b === "" || b === null) return -1;
    if (a === b) return 0;
    return a < b ? -1 : 1;
  });
