import { Inter, Lora } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-lora",
});
