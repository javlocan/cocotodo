"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import styles from "./ByeButton.module.css";
export const ByeButton = () => {
  const router = useRouter();
  return (
    <button
      className={styles.byeButton}
      onClick={() => {
        signOut();
        router.replace("/");
      }}
    >
      <Image
        className={styles.byeImg}
        src="/icons/icons8-logout-100.png"
        alt="Go to dashboard"
        width={40}
        height={40}
      />
    </button>
  );
};
