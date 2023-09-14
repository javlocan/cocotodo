"use client";

import dayjs from "dayjs";
import React from "react";
import styles from "./TodoCard.module.css";
import { Todo } from "types";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const TodoCard = ({
  todo,
  projectId,
}: {
  todo: Todo;
  projectId: string;
}) => {
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
      </section>
      <section className={styles.card__interaction}>
        <Image
          src="/icons/comments.png"
          alt="Edit task"
          width={24}
          height={24}
        />
        <Image src="/icons/edit.png" alt="Edit task" width={24} height={24} />
        <Image
          src="/icons/delete.png"
          alt="Edit task"
          width={24}
          height={24}
          onClick={handleDelete}
        />
      </section>
    </article>
  );
};
