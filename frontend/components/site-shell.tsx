"use client";

import Link from "next/link";
import { ReactNode } from "react";

import { CompanyProfile } from "@/lib/types";

import { Footer } from "./footer";

interface SiteShellProps {
  children: ReactNode;
  profile: CompanyProfile;
}

const navigation = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/sectors", label: "Sectors" },
  { href: "/projects", label: "Projects" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" }
];

export function SiteShell({ children, profile }: SiteShellProps) {
  return (
    <div className="site-shell">
      <div className="top-bar">
        <div className="container top-bar-content">
          <span>{profile.headquarters}</span>
          <div className="top-bar-links">
            <a href={`tel:${profile.phone}`}>{profile.phone}</a>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="container nav-shell">
          <Link href="/" className="brand-mark">
            <span className="brand-mark-badge">MB</span>
            <span>
              <strong>Mandalibuilders</strong>
              <small>Construction Company</small>
            </span>
          </Link>
          <nav className="site-nav">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/contact" className="button button-small">
              {profile.hero_primary_cta}
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>
      <Footer profile={profile} />
    </div>
  );
}
