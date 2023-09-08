"use client";

import { SessionProvider } from "next-auth/react";

export const NextAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return <SessionProvider>{children}</SessionProvider>;
};
