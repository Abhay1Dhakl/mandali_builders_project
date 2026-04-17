"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { CompanyProfile } from "@/lib/types";

import { SiteShell } from "./site-shell";

interface ConditionalShellProps {
  children: ReactNode;
  profile: CompanyProfile;
}

export function ConditionalShell({ children, profile }: ConditionalShellProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return <SiteShell profile={profile}>{children}</SiteShell>;
}
