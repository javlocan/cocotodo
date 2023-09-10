"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import styles from "./Login.module.css";
export const LoginForm = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const res = await signIn(
      "credentials",
      {
        username: formData.get("username"),
        password: formData.get("password"),
        redirect: false,
      },
      { register: "false" }
    );
    if (res?.error) {
      setError(res.error as string), setIsLoading(false);
    } else return router.replace("/dashboard");
  };

  return (
    <div className={styles.form__container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        <h2>Log In</h2>

        <label>Username:</label>
        <input type="text" placeholder="username" name="username" />

        <label>Password:</label>
        <input type="password" placeholder="*********" name="password" />

        <button disabled={isLoading}>Log In</button>
      </form>
    </div>
  );
};
