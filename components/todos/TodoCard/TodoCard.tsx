"use client";

import React from "react";
import styles from "./TodoCard.module.css";
import { Todo } from "types";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const TodoCard = React.memo(function TodoCard({
  todo,
  projectId,
}: {
  todo: Todo;
  projectId: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(
      `/api/todos?todoId=${todo._id}&projectId=${projectId}`,
      {
        method: "DELETE",
      }
    );
    const result = await res.json();
    if (!result.error) router.refresh();
  };
  return (
    <article className={styles.card}>
      <section className={styles.card__content}>
        <input className={styles.checkbox} type="checkbox" />
        <h3 className={styles.name}>{todo.title}</h3>
        {todo.deadline ? (
          <p className={styles.description}>{todo.deadline}</p>
        ) : (
          <p>S.F.</p>
        )}
      </section>
      <section className={styles.card__interaction}>
        <Image
          src="/icons/comments.png"
          alt="Edit task"
          width={64}
          height={64}
        />
        <Image src="/icons/edit.png" alt="Edit task" width={64} height={64} />
        <Image
          src="/icons/delete.png"
          alt="Edit task"
          width={64}
          height={64}
          onClick={handleDelete}
        />
      </section>
    </article>
  );
});
