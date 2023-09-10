"use client";

import { FormEvent, useState } from "react";
import styles from "./NewGroupForm.module.css";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";

export const NewGroupForm = () => {
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
      members: [session?.user?._id],
    };

    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    if (result.error) {
      setError(result.error);
    }
    if (result.group) {
      router.refresh();
    }
    setIsLoading(false);
    console.log("Fetched data:", result);
  };
  return (
    <div className={styles.form__container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        <h2>Create new group:</h2>

        <label>Group name:</label>
        <input type="text" placeholder="My group" name="name" />

        <label>Description (optional):</label>
        <input
          placeholder="Work group from this organization"
          name="description"
        />

        <button disabled={isLoading}>Create account</button>
      </form>
    </div>
  );
};
