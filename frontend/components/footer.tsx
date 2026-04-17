import Link from "next/link";

import { CompanyProfile } from "@/lib/types";

interface FooterProps {
  profile: CompanyProfile;
}

export function Footer({ profile }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <span className="eyebrow">Mandali Builders</span>
          <h3>{profile.tagline}</h3>
          <p>{profile.overview}</p>
        </div>
        <div>
          <h4>Navigate</h4>
          <div className="footer-links">
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/sectors">Sectors</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/insights">Insights</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h4>Reach Us</h4>
          <div className="footer-links">
            <a href={`tel:${profile.phone}`}>{profile.phone}</a>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <span>{profile.address}</span>
            <Link href="/admin/login">Admin panel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
