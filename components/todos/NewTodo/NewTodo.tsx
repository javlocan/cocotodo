"use client";

import { FormEvent, useState } from "react";
import styles from "./NewTodo.module.css";
import Image from "next/image";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const NewTodo = ({ projectId }: { projectId: string }) => {
  const [openForm, setOpenForm] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Dayjs>(dayjs(new Date()));
  const { data: session } = useSession();

  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    if (title.length < 5) return alert("Title must be at least 5 characters");
    const body = {
      title,
      deadline: date,
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

  const handleDateChange = (value: Dayjs) => {
    setDate(value);
    setShowPicker(!showPicker);
  };

  return (
    <article className={styles.card}>
      <section className={styles.card__content}>
        <form id="newtodo" onSubmit={handleSubmit}></form>

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
          onChange={(value) => {
            if (value) handleDateChange(value);
          }}
          className={styles.date__input}
          disabledDate={(current: Dayjs) =>
            current && current < dayjs().startOf("day")
          }
          format="DD/MM/YYYY"
          inputReadOnly
          bordered={false}
          suffixIcon={false}
          open={showPicker}
          placeholder="S.F."
          value={date}
        />
      </section>
      <section className={styles.card__interaction}>
        <Image
          onClick={() => setShowPicker(!showPicker)}
          src="/icons/timetable.png"
          alt="Asign deadline"
          width={64}
          height={64}
        />
        <Image
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
};
