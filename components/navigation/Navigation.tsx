"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navigation.module.css";
import { ByeButton } from "../auth";

import { useState } from "react";
import { Avatar, Divider } from "antd";

export function Navigation() {
  const { status, data: session } = useSession();

  const NavCirculito = (): JSX.Element => {
    return session ? (
      session?.user?.image ? (
        <Avatar src={session?.user?.image} />
      ) : (
        <Avatar
          size="large"
          gap={3}
          style={{
            backgroundColor: `hsl(${Math.random() * 360} 45% 45%)`,
            height: "48px",
            width: "48px",
            lineHeight: 3.4,
          }}
        >
          {session?.user?.displayname || session?.user?.username}
        </Avatar>
      )
    ) : (
      <Image src={"/logo.png"} alt={"Logo"} width={50} height={50} />
    );
  };

  return (
    <nav id="navigation" className={styles.nav__container}>
      <header className={styles.nav__header} id="header">
        <NavCirculito />
        <Link href="/dashboard">
          <Image
            src="/icons/icons8-house-100.png"
            alt="Go to dashboard"
            width={40}
            height={40}
            className={styles.invert}
          />
        </Link>
      </header>
      <footer className={styles.nav__footer}>
        <Divider style={{ background: "rgba(255, 255, 255, 0.25)" }} />
        {status === "authenticated" ? <ByeButton /> : ""}
      </footer>
    </nav>
  );
}
