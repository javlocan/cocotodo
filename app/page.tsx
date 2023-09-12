import styles from "./page.module.css";
import { LoginForm, RegisterForm } from "@/components/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) redirect("/dashboard");

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>todococo</h1>
      <div className={styles.forms__container}>
        <LoginForm />
        <RegisterForm />
      </div>
    </main>
  );
}
