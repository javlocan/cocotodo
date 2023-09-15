import type { Metadata } from "next";

import "./globals.css";

import { Navigation } from "@/c/navigation";
import { NextAuthProvider } from "@/libs/auth/";
import { lora, inter } from "./fonts";

import { ConfigProvider } from "antd";
import esES from "antd/es/locale/es_ES";
import dayjs from "dayjs";

dayjs.locale("es");

const theme = {
  components: {
    Spin: { colorPrimary: "#444" },
  },
};

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
      <body className={`${inter.className} ${lora.variable}`}>
        <ConfigProvider locale={esES} theme={theme}>
          <NextAuthProvider>
            <Navigation />
            <div className="scroller">{children}</div>
          </NextAuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
