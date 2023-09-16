"use client";

import { TodoCard } from "@/components/todos/TodoCard/TodoCard";
import { Project, Todo } from "types";

import styles from "./TodoPanel.module.css";
import dayjs from "dayjs/esm";
import { useEffect } from "react";
import { stagger, useAnimate } from "framer-motion";
import { useSocket } from "@/lib/SocketProvider/SocketProvider";

export const TodoPanel = ({ project }: { project: Project }) => {
  // En el video él pasa algunos parametros desde la página
  // le pasa la apiUrl : /api/socket/PROJECTS SERIA VA EN OTRO SITIO SI
  // le pasa la query, que la puedo montar yo aqui
  // le pasa un "name" que es el nombre del Channel que será el id del proyecto seguro
  // le pasa un tipo que no voy a usar

  // DIFERENCIA: él manda un form

  /* useEffect(() => {
    console.log("is socket?", socket !== null);
    if (!socket) return;

    const channelKey = `updateProject:${project._id}`;
    socket.on(channelKey, () => {
      console.log("socket is receiving");
    });
  }); */
  const todos = project.todos.sort((prev: Todo, post: Todo) => {
    const a: any =
      parseInt(dayjs(prev.deadline).format("YYYYMMDDHHmmss")) || null;
    const b: any =
      parseInt(dayjs(post.deadline).format("YYYYMMDDHHmmss")) || null;
    if (a === "" || a === null) return 1;
    if (b === "" || b === null) return -1;
    if (a === b) return 0;
    return a < b ? -1 : 1;
  });
  const [scope, animate] = useAnimate();
  useEffect(() => {
    animate(
      ".todocard",
      { y: [10, 0], opacity: [0, 1] },
      { delay: stagger(0.05) }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={styles.todos__container} ref={scope}>
      {todos?.map((todo: Todo, i: number) => {
        // Si mañana es el mismo dia, height cambia
        const isSameDayAsTomorrow = dayjs(todo.deadline).isSame(
          todos[i + 1]?.deadline,
          "day"
        );
        const isFirstNullDeadline =
          todo.deadline === null && todos[i - 1].deadline !== null;
        const deadline =
          i !== 0
            ? todo.deadline &&
              !dayjs(todo.deadline).isSame(todos[i - 1]?.deadline, "day")
              ? dayjs(todo.deadline).format("dddDD")
              : ""
            : dayjs(todo.deadline).format("dddDD");
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
            <TodoCard key={todo._id} todo={todo} projectId={project._id} />
            {newmonth ? <div className={styles.month}>{newmonth}</div> : null}
          </>
        );
      })}
    </section>
  );
};
