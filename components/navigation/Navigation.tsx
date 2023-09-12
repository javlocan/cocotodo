"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navigation.module.css";
import { ByeButton } from "../auth";

export function Navigation() {
  const { status, data: session } = useSession();

  return (
    <nav className={styles.nav__container}>
      <header className={styles.nav__header}>
        <Link href="/dashboard">
          <Image
            src="/icons/icons8-house-100.png"
            alt="Go to dashboard"
            width={40}
            height={40}
          />
        </Link>
      </header>
      <footer className={styles.nav__footer}>
        {status === "authenticated" ? <ByeButton /> : ""}
      </footer>
    </nav>
  );
}
