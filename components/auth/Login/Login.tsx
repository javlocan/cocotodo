"use client";

import { FormEvent, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import styles from "./Login.module.css";
export const Login = () => {
  const [error, setError] = useState("");
  const { status } = useSession();
  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });
    console.log(res);
    if (res?.error) setError(res.error as string);
    else return router.push("/dashboard");
  };

  return (
    <div className={styles.form__container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        <h2>Log In</h2>

        <label>Username:</label>
        <input type="username" placeholder="username" name="username" />

        <label>Password:</label>
        <input type="password" placeholder="*********" name="password" />

        <button disabled={status === "authenticated"}>Log In</button>
      </form>
    </div>
  );
};
