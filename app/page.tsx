import styles from "./page.module.css";
import { Login } from "@/components/auth";
import { Register } from "@/components/auth/Register/Register";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  if (session) return redirect("/dashboard");
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>todococo</h1>
      <Login />
      <Register />
    </main>
  );
}
/* 
"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Login } from "@/components/Login";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/dashboard");
      // The user is not authenticated, handle it here.
    },
  });

  if (status === "loading") return <h1>Loading</h1>;
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>todococo</h1>
      <Login />
    </main>
  );
}
 */
