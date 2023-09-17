"use client";

import React from "react";
import styles from "./TodoCard.module.css";
import { Todo } from "types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const TodoCard = ({
  todo,
  projectId,
  stagger,
  renderObject,
}: {
  todo: Todo;
  projectId: string;
  stagger: number;
  renderObject: any;
}) => {
  const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(`/api/todos?todoId=${todo._id}&projectId=${projectId}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (!result.error) router.refresh();
  };

  const deadline = renderObject.deadline;
  const isSameDayAsTomorrow = renderObject.isSameDayAsTomorrow;
  return (
    <motion.article layout className={`${styles.card} todocard`}>
      <motion.aside
        layout
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          type: "Spring",
          transition: { duration: 1 },
        }}
        exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
        className={`${styles.deadline}  ${!isSameDayAsTomorrow ? styles.lastday : " "} ${
          todo.deadline === null ? styles.null : ""
        }`}
      >
        <span>{deadline}</span>
      </motion.aside>
      <motion.section
        layout
        initial={{ opacity: 0, y: -30 }}
        animate={{
          opacity: 1,
          y: 0,
          type: "Spring",
          transition: { duration: 0.5, delay: stagger },
        }}
        exit={{ opacity: 0, y: 0, x: 80, transition: { duration: 0.4 } }}
        className={styles.card__content}
      >
        <input className={styles.checkbox} type="checkbox" />
        <h3 className={styles.name}>{todo.title}</h3>
      </motion.section>
      <section className={styles.card__interaction}>
        <Image src="/icons/comments.png" alt="Edit task" width={24} height={24} />
        <Image src="/icons/edit.png" alt="Edit task" width={24} height={24} />
        <Image
          src="/icons/delete.png"
          alt="Edit task"
          width={24}
          height={24}
          onClick={handleDelete}
        />
      </section>
    </motion.article>
  );
};
