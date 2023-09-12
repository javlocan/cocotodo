"use client";

import { FormEvent, useState } from "react";
import styles from "./NewProjectForm.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const NewProjectForm = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const body = {
      name: formData.get("name"),
      description: formData.get("description"),
      ownerId: session?.user?._id,
      participants: [session?.user?._id],
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await res.json();

    setIsLoading(false);
    if (result.error) {
      setError(result.error);
    }

    if (result.project) {
      router.refresh();
    }
  };
  return (
    <div className={styles.form__container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        <h2>Create new Project:</h2>

        <label>Project name:</label>
        <input type="text" placeholder="My group" name="name" />

        <label>Description (optional):</label>
        <input placeholder="This is a project" name="description" />

        <button disabled={isLoading}>Create Project</button>
      </form>
    </div>
  );
};
