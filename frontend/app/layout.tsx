import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";

import { ConditionalShell } from "@/components/conditional-shell";
import { getSiteData } from "@/lib/api";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Mandali Builders | Professional Construction Company",
  description:
    "Mandali Builders — a leading construction company delivering commercial, residential, and infrastructure projects with precision and transparency."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const { profile } = await getSiteData();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <ConditionalShell profile={profile}>{children}</ConditionalShell>
      </body>
    </html>
  );
}
