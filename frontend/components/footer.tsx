"use client";

import Link from "next/link";

import { CompanyProfile } from "@/lib/types";

interface FooterProps {
  profile: CompanyProfile;
}

export function Footer({ profile }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand col */}
          <div className="footer-brand">
            <strong>Mandali Builders</strong>
            <p>{profile.tagline}</p>
            <p style={{ marginTop: "0.6rem" }}>{profile.overview}</p>
          </div>

          {/* Navigation col */}
          <div className="footer-col">
            <h4>Company</h4>
            <div className="footer-links">
              <Link href="/about">Our Company</Link>
              <Link href="/services">Our Services</Link>
              <Link href="/projects">Our Projects</Link>
              <Link href="/sectors">Sectors</Link>
              <Link href="/insights">News &amp; Insights</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          {/* Contact col */}
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-links">
              <a href={`tel:${profile.phone}`}>{profile.phone}</a>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span>{profile.address}</span>
              <Link href="/admin/login" style={{ marginTop: "0.5rem", opacity: 0.5 }}>
                Admin Panel
              </Link>
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Mandali Builders Construction Company. All rights reserved.</span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
