"use client";

import Link from "next/link";
import { ReactNode } from "react";

import { CompanyProfile } from "@/lib/types";

import { Footer } from "./footer";
import { PageMotion } from "./page-motion";

interface SiteShellProps {
  children: ReactNode;
  profile: CompanyProfile;
}

const navigation = [
  { href: "/about", label: "Our Company" },
  { href: "/services", label: "Our Services" },
  { href: "/projects", label: "Our Projects" },
  { href: "/insights", label: "News & Insights" },
  { href: "/sectors", label: "Sectors" },
  { href: "/contact", label: "Contact" }
];

export function SiteShell({ children, profile }: SiteShellProps) {
  return (
    <div className="site-shell">
      {/* Top utility bar */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <span>{profile.headquarters}</span>
          <div className="top-bar-links">
            <a href={`tel:${profile.phone}`}>{profile.phone}</a>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <Link href="/contact" style={{ fontWeight: 600 }}>
              Become a Subcontractor
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="site-header">
        <div className="container nav-shell">
          <Link href="/" className="brand-mark">
            <span className="brand-mark-badge">MB</span>
            <span>
              <strong>Mandali Builders</strong>
              <small>Construction Company</small>
            </span>
          </Link>

          <nav className="site-nav">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/contact" className="button button-small" style={{ marginLeft: "0.5rem" }}>
              Get in Touch
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <PageMotion>{children}</PageMotion>
      </main>
      <Footer profile={profile} />
    </div>
  );
}
