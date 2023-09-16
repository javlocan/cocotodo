"use client";

import { FormEvent, useState } from "react";
import styles from "./NewProjectForm.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Group } from "types";
import { Button, Input, Select } from "antd";

interface UserValue {
  label: string;
  value: string;
}
export const NewProjectForm = ({ groups }: { groups: [Group] }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  // Owner handling, id's , group/you ----------------

  const [owner, setOwner] = useState<UserValue>({
    value: session?.user?._id,
    label: session?.user?.displayname || session?.user?.username || "",
  });

  const optionGroups: UserValue[] = groups.map((group) => ({
    value: group._id,
    label: "[G] " + group.name,
  }));

  optionGroups.unshift({
    value: session?.user?._id,
    label:
      "[I] " + session?.user?.displayname ||
      (session?.user?.username as string),
  });

  // HANDLING the submit and fetch   ----------------

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const body = {
      name: formData.get("name"),
      description: formData.get("description"),
      ownerId: owner.value,
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
      setIsLoading(false);
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

        <label>
          <span>Project name:</span>
          <Input type="text" placeholder="My new project" name="name" />
        </label>
        <label>
          <span>Description (optional):</span>
          <Input placeholder="This is a project" name="description" />
        </label>
        <label>
          <span>Individual o grupal</span>
          <Select
            style={{ width: "100%", marginTop: "5px" }}
            labelInValue
            onChange={(newValue) => {
              setOwner(newValue);
            }}
            options={optionGroups}
            value={owner}
          />
        </label>
        <div className={styles.submit}>
          <Button size="large" disabled={isLoading} htmlType="submit">
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
};
