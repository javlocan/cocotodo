"use client";

import { FormEvent, useState } from "react";

import styles from "./Register.module.css";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
export const RegisterForm = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const passwordrepeat = formData.get("passwordrepeat") as string;
    if (password !== passwordrepeat) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password needs to be at least 6 characters.");
      return;
    }
    const res = await signIn(
      "credentials",
      {
        username: formData.get("username"),
        password,
        redirect: false,
      },
      { register: "true", email: formData.get("email") as string }
    );
    if (res?.error) {
      setError(res.error as string);
      setIsLoading(false);
    } else return router.push("/dashboard");
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

        <button disabled={isLoading}>Create account</button>
      </form>
    </div>
  );
};
