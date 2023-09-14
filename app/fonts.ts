import { Inter, Fraunces } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  axes: ["WONK", "SOFT", "opsz"],
  variable: "--font-fraunces",
});
