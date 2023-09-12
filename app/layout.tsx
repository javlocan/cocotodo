import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { Navigation } from "@/c/navigation";
import { NextAuthProvider } from "@/libs/auth/";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <NextAuthProvider>
          <Navigation />
          <div className="scroller">{children}</div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
