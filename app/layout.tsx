import type { Metadata } from "next";

import "./globals.css";

import { Navigation } from "@/c/navigation";
import { NextAuthProvider } from "@/libs/auth/";
import { fraunces, inter } from "./fonts";

export const metadata: Metadata = {
  title: "todococo",
  description: "A delicious collaborative todo application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${fraunces.variable}`}>
        <NextAuthProvider>
          <Navigation />
          <div className="scroller">{children}</div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
