"use client";

import { FormEvent, useState } from "react";
import styles from "./NewGroupForm.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input } from "antd";

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
  };
  return (
    <div className={styles.form__container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        <h2>Create new group:</h2>

        <label>
          <span>Group name:</span>
          <Input type="text" placeholder="My group" name="name" />
        </label>
        <label>
          <span>Description (optional):</span>
          <Input
            placeholder="Work group from this organization"
            name="description"
          />
        </label>
        <div className={styles.submit}>
          <Button disabled={isLoading} size="large">
            Create Group
          </Button>
        </div>
      </form>
    </div>
  );
};
