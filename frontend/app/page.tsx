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
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Mandali Builders</span>
            <h1>{data.profile.hero_title}</h1>
            <p>{data.profile.hero_subtitle}</p>
            <div className="hero-actions">
              <Link href="/contact" className="button">
                {data.profile.hero_primary_cta}
              </Link>
              <Link href="/projects" className="button button-secondary">
                {data.profile.hero_secondary_cta}
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-pill">
                <span>Experience</span>
                <strong>{data.profile.years_experience}+ years</strong>
              </div>
              <div className="stat-pill">
                <span>Projects</span>
                <strong>{data.profile.completed_projects}</strong>
              </div>
              <div className="stat-pill">
                <span>Annual volume</span>
                <strong>{data.profile.annual_volume}</strong>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-card">
              <span className="eyebrow">Why Clients Return</span>
              <h2>{data.profile.client_retention} client retention</h2>
              <p>
                We combine preconstruction rigor, disciplined site execution, and transparent
                decision-making across every phase of delivery.
              </p>
            </div>
            <div className="hero-panel-grid">
              {data.commitments.slice(0, 4).map((item, index) => (
                <article key={item.id} className={`mini-panel accent-${item.accent}`}>
                  <span>0{index + 1}</span>
                  <strong>{item.title}</strong>
                  <p>{item.subtitle}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Profile"
            title="A modern construction platform modeled on the structure serious owners expect"
            description={data.profile.overview}
          />
          <div className="feature-split">
            <div className="feature-card large">
              <h3>{data.profile.vision}</h3>
              <p>
                From business districts and hospitals to resorts and infrastructure corridors, our
                teams plan for certainty and build for long-term value.
              </p>
            </div>
            <div className="feature-card-stack">
              <div className="feature-card">
                <span className="eyebrow">Headquarters</span>
                <strong>{data.profile.headquarters}</strong>
                <p>{data.profile.address}</p>
              </div>
              <div className="feature-card">
                <span className="eyebrow">Operational Focus</span>
                <strong>Schedule, safety, quality, transparency</strong>
                <p>Digital controls and field leadership aligned around complex delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="Capabilities"
            title="Services that carry projects from strategy to handover"
            description="The system mirrors a large construction company structure: preconstruction, delivery leadership, sector expertise, portfolio proof, and a direct lead-generation funnel."
          />
          <div className="service-grid">
            {data.services.map((service, index) => (
              <article key={service.id} className="service-card">
                <div className="service-card-header">
                  <span>0{index + 1}</span>
                  <strong>{service.name}</strong>
                </div>
                <p>{service.short_description}</p>
                <small>{service.detailed_description}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Market Sectors"
            title="Deep sector understanding for public and private owners"
            description="Each sector page can be expanded through the admin panel with focused content, visual positioning, and portfolio examples."
          />
          <div className="sector-grid">
            {data.sectors.map((sector) => (
              <article
                key={sector.id}
                className="sector-card"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(10, 18, 31, 0.12), rgba(10, 18, 31, 0.86)), url(${sector.image})` }}
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

      <section className="section section-dark">
        <div className="container">
          <SectionHeading
            eyebrow="Featured Work"
            title="Projects that prove delivery range and technical discipline"
            description="Portfolio entries are fully editable through the admin dashboard and support sector tagging, location, headline, impact story, and image-driven presentation."
          />
          <div className="project-grid">
            {data.featured_projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Insights"
            title="Thought leadership and company news, presented like a mature contractor platform"
            description="The CMS supports new articles from the admin panel so the website can stay active with market insight, project announcements, and delivery learnings."
          />
          <div className="insight-grid">
            {data.featured_insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band">
          <div>
            <span className="eyebrow">Regional Presence</span>
            <h2>Local teams with a flagship headquarters and project-facing regional offices</h2>
          </div>
          <div className="office-list">
            {data.offices.map((office) => (
              <div key={office.id} className="office-pill">
                <strong>{office.city}</strong>
                <span>{office.manager}</span>
              </div>
            ))}
          </div>
          <Link href="/contact" className="button">
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  );
}
