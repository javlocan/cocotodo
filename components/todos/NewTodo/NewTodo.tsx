"use client";

import { FormEvent, useState } from "react";
import styles from "./NewTodo.module.css";
import Image from "next/image";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const NewTodo = ({ projectId }: { projectId: string }) => {
  const [openTodo, setOpenTodo] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const { data: session } = useSession();

  const [deadline, setDeadline] = useState<Dayjs | null>(null);

  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const title = formData.get("title") as string;
    if (title.length < 6)
      return alert("El título debe tener 6 carácteres al menos");
    const body = {
      title,
      deadline,
      content: "",
      creatorId: session?.user?._id,
      projectId,
    };

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    if (!result.error) router.refresh();
  };

  if (openTodo)
    return (
      <article className={styles.card}>
        <form id="newtodo" onSubmit={handleSubmit}>
          <section className={styles.card__content}>
            <Image
              onClick={() => setOpenForm(!openForm)}
              className={styles.open__arrow}
              style={openForm ? { rotate: "0deg" } : {}}
              src="/icons/arrow-line.png"
              alt="Cancel task creation"
              width={20}
              height={20}
            />
            <input
              form="newtodo"
              className={styles.name__input}
              type="text"
              name="title"
              placeholder="Tìtulo de mi nueva tarea"
            />

            <DatePicker
              name="deadline"
              onSelect={() => setShowPicker(false)}
              onChange={(value) => setDeadline(value)}
              className={styles.date__input}
              disabledDate={(current: Dayjs) =>
                current && current < dayjs().startOf("day")
              }
              format="DD/MM/YYYY"
              inputReadOnly
              allowClear
              bordered={false}
              suffixIcon={false}
              open={showPicker}
              placeholder="S.F."
              value={deadline}
            />
          </section>
        </form>
        <section className={styles.card__interaction}>
          <Image
            onClick={() => setShowPicker(!showPicker)}
            src="/icons/timetable.png"
            alt="Asign deadline"
            width={64}
            height={64}
          />
          <Image
            onClick={() => setOpenTodo(false)}
            src="/icons/delete.png"
            alt="Cancel task creation"
            width={64}
            height={64}
          />
          <div className={styles.save}>
            <button type="submit" style={{ border: "none" }} form="newtodo">
              <Image
                src="/icons/save.png"
                alt="Create task"
                width={64}
                height={64}
              />
            </button>
          </div>
        </section>
      </article>
    );
  return (
    <article className={styles.newTodo__container}>
      <section
        className={styles.newTodo__content}
        onClick={() => setOpenTodo(true)}
      >
        <Image
          className={styles.newTodo__icon}
          src="/icons/new-todo.png"
          alt="Añadir tarea nueva"
          width={64}
          height={64}
        />
      </section>
    </article>
  );
};
