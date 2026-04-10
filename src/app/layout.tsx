import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { AuthProvider } from "@/modules/auth/presentation/auth-provider";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Action Planner",
  description: "Planejamento operacional de acoes de campo com foco mobile-first.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={manrope.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}