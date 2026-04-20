import Link from "next/link";

import { InsightCard } from "@/components/insight-card";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { getSiteData } from "@/lib/api";

export default async function HomePage() {
  const data = await getSiteData();
  const sectorCounts = data.projects.reduce<Record<string, number>>((accumulator, project) => {
    const key = project.sector?.slug ?? "other";
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-section">
        {/* Background image — uses a high-quality construction photo */}
        <div
          className="hero-bg"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=80)"
          }}
        />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="container">
            <span className="hero-tagline">Mandali Builders — Built for Impact</span>
            <h1>
              Making a <em>Difference</em>
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.72)",
                fontSize: "1.05rem",
                maxWidth: "48ch",
                marginTop: "1.2rem"
              }}
            >
              {data.profile.hero_subtitle}
            </p>

            <div className="hero-actions">
              <Link href="/contact" className="button">
                {data.profile.hero_primary_cta}
              </Link>
              <Link href="/projects" className="button-outline">
                {data.profile.hero_secondary_cta}
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-pill">
                <span>Experience</span>
                <strong>{data.profile.years_experience}+ Years</strong>
              </div>
              <div className="stat-pill">
                <span>Projects</span>
                <strong>{data.profile.completed_projects}</strong>
              </div>
              <div className="stat-pill">
                <span>Annual Volume</span>
                <strong>{data.profile.annual_volume}</strong>
              </div>
              <div className="stat-pill">
                <span>Client Retention</span>
                <strong>{data.profile.client_retention}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Band ────────────────────────────────────── */}
      <section className="stats-band">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <strong>{data.profile.years_experience}+</strong>
              <span>Years of Experience</span>
            </div>
            <div className="stat-card">
              <strong>{data.profile.completed_projects}</strong>
              <span>Projects Completed</span>
            </div>
            <div className="stat-card">
              <strong>{data.profile.client_retention}</strong>
              <span>Client Retention Rate</span>
            </div>
            <div className="stat-card">
              <strong>{data.profile.annual_volume}</strong>
              <span>Annual Build Volume</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Company Profile ───────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Who We Are"
            title={data.profile.vision ?? "A modern construction platform built for serious owners"}
            description={data.profile.overview}
          />
          <div className="feature-split">
            <div className="feature-card large">
              <h3>{data.profile.vision}</h3>
              <p>
                From business districts and hospitals to resorts and infrastructure corridors, our
                teams plan for certainty and build for long-term value.
              </p>
              <Link
                href="/about"
                className="arrow-link light"
                style={{ marginTop: "2rem", color: "rgba(255,255,255,0.75)" }}
              >
                Learn More About Us
                <span className="arrow-icon">→</span>
              </Link>
            </div>
            <div className="feature-card-stack">
              <div className="feature-card">
                <span className="eyebrow">Headquarters</span>
                <strong>{data.profile.headquarters}</strong>
                <p>{data.profile.address}</p>
              </div>
              <div className="feature-card">
                <span className="eyebrow">Operational Focus</span>
                <strong>Schedule, Safety, Quality & Transparency</strong>
                <p>Digital controls and field leadership aligned around complex delivery.</p>
              </div>
              <div className="feature-card">
                <span className="eyebrow">Contact</span>
                <strong>
                  <a href={`tel:${data.profile.phone}`}>{data.profile.phone}</a>
                </strong>
                <p>
                  <a href={`mailto:${data.profile.email}`}>{data.profile.email}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────── */}
      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="Capabilities"
            title="Services that carry projects from strategy to handover"
            description="Full-spectrum construction management — from preconstruction planning through safe, on-schedule delivery."
          />
          <div className="service-grid">
            {data.services.map((service, index) => (
              <article key={service.id} className="service-card">
                <span className="service-card-number">0{index + 1}</span>
                <strong>{service.name}</strong>
                <p>{service.short_description}</p>
                <small>{service.detailed_description}</small>
              </article>
            ))}
          </div>
          <div style={{ marginTop: "2.5rem" }}>
            <Link href="/services" className="arrow-link">
              View All Services
              <span className="arrow-icon">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Market Sectors ────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Market Sectors"
            title="Deep sector understanding for public and private owners"
            description="Specialized delivery teams with proven track records across every major building type."
          />
          <div className="sector-grid">
            {data.sectors.map((sector) => (
              <article
                key={sector.id}
                className="sector-card"
                style={{
                  backgroundImage: `url(${sector.image})`
                }}
              >
                <div>
                  <span className="eyebrow">{sector.hero_stat}</span>
                  <h3>{sector.name}</h3>
                  <p>{sector.short_description}</p>
                </div>
                <strong>{sectorCounts[sector.slug] ?? 0} projects represented</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────── */}
      <section className="section section-dark">
        <div className="container">
          <SectionHeading
            eyebrow="Featured Work"
            title="Projects that prove our delivery range and technical discipline"
            description="Portfolio entries that demonstrate Mandali Builders' commitment to quality at every scale."
          />
          <div className="project-grid">
            {data.featured_projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div style={{ marginTop: "2.5rem" }}>
            <Link href="/projects" className="arrow-link" style={{ color: "rgba(255,255,255,0.65)" }}>
              View All Projects
              <span className="arrow-icon" style={{ borderColor: "rgba(255,255,255,0.5)" }}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Life at Mandali (split) ───────────────────────── */}
      <section className="split-section">
        <div
          className="split-image"
          style={{ minHeight: "480px" }}
        >
          <img
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&q=80"
            alt="Mandali Builders team on site"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="split-content muted">
          <span className="eyebrow">Life at Mandali Builders</span>
          <h2>Ambitious People, Impactful Work</h2>
          <p style={{ marginTop: "1rem", fontSize: "1rem", color: "var(--text-soft)" }}>
            At Mandali Builders, you will work with people who share your passion for solving
            challenging problems and making a lasting difference in every community we build.
          </p>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/contact" className="arrow-link">
              Explore a Career with Mandali
              <span className="arrow-icon">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── News & Insights ───────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="News & Insights"
            title="Thought leadership and company news"
            description="Stay informed with our latest project announcements, industry insights, and company updates."
          />
          <div className="insight-grid">
            {data.featured_insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
          <div style={{ marginTop: "2.5rem" }}>
            <Link href="/insights" className="arrow-link">
              View All Insights
              <span className="arrow-icon">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Regional Offices CTA ──────────────────────────── */}
      <section className="cta-band">
        <div className="container">
          <div className="cta-band-inner">
            <div>
              <span className="eyebrow">Regional Presence</span>
              <h2>
                Local teams with a flagship headquarters and project-facing regional offices
              </h2>
              <div className="office-list">
                {data.offices.map((office) => (
                  <div key={office.id} className="office-pill">
                    <strong>{office.city}</strong>
                    <span>{office.manager}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/contact" className="button">
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
