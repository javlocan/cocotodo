"use client";
import { signOut } from "next-auth/react";

export const ByeButton = () => {
  return (
    <button
      onClick={() => {
        signOut();
      }}
      style={{ padding: "0.5rem" }}
    >
      BAAAII
    </button>
  );
};
