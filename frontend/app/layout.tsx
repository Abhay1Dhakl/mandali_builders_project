import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { ConditionalShell } from "@/components/conditional-shell";
import { getSiteData } from "@/lib/api";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Mandali Builders",
  description: "Professional construction company platform for Mandali Builders."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const { profile } = await getSiteData();

  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cormorant.variable}`}>
        <ConditionalShell profile={profile}>{children}</ConditionalShell>
      </body>
    </html>
  );
}
