import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Geist_Mono,
  Montserrat_Alternates,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontPrimary = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["500", "600", "700", "800"],
});

const fontSecondary = Montserrat_Alternates({
  subsets: ["latin"],
  variable: "--font-secondary",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Love AI",
  description:
    "Love AI is a roleplay game where you can roleplay with AI characters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontPrimary.variable} ${fontSecondary.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
