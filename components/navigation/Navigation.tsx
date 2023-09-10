"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navigation.module.css";
import { ByeButton } from "../auth";

export function Navigation() {
  const { status, data: session } = useSession();

  return (
    <nav>
      <Link href="/">
        <Image src="/logo.png" alt="Coconut Logo" width={40} height={40} />
      </Link>
      <h1>cocotodo</h1>
      {status == "authenticated" ? (
        <h2 style={{ color: "#777" }}>
          {session?.user?.username?.toLocaleLowerCase()}
        </h2>
      ) : (
        <></>
      )}
      <Link href="/dashboard">Dashboard</Link>
      {status === "authenticated" ? <ByeButton /> : ""}
    </nav>
  );
}
