"use client";

import { FormEvent, useState } from "react";

import styles from "./Register.module.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
export const Register = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { status } = useSession();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        passwordrepeat: formData.get("passwordrepeat"),
      }),
    });

    const { message } = await res.json();
    if (res.status !== 201) setError(message as string);
    else return router.push("/dashboard");
  };

  return (
    <div className={styles.form__container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        <h2>Register</h2>

        <label>Username:</label>
        <input type="username" placeholder="username" name="username" />

        <label>Email:</label>
        <input type="email" placeholder="email" name="email" />

        <label>Password:</label>
        <input type="password" placeholder="*********" name="password" />
        <label>Repeat password:</label>
        <input type="password" placeholder="*********" name="passwordrepeat" />

        <button disabled={status === "authenticated"}>Create account</button>
      </form>
    </div>
  );
};
