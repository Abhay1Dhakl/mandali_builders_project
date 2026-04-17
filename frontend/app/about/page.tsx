import { SectionHeading } from "@/components/section-heading";
import { getSiteData } from "@/lib/api";

export default async function AboutPage() {
  const data = await getSiteData();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About Us</span>
          <h1>Built for clients who need more than a contractor</h1>
          <p>{data.profile.overview}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-split">
            <div className="feature-card large">
              <span className="eyebrow">Vision</span>
              <h2>{data.profile.vision}</h2>
              <p>
                Mandali Builders was positioned as a high-trust, full-service construction company
                with the content depth, visual polish, and client pathways expected from a large
                international contractor website.
              </p>
            </div>
            <div className="metrics-card">
              <div>
                <span>Years of experience</span>
                <strong>{data.profile.years_experience}+</strong>
              </div>
              <div>
                <span>Completed projects</span>
                <strong>{data.profile.completed_projects}</strong>
              </div>
              <div>
                <span>Annual volume</span>
                <strong>{data.profile.annual_volume}</strong>
              </div>
              <div>
                <span>Client retention</span>
                <strong>{data.profile.client_retention}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="Our Commitments"
            title="The operating principles behind the company profile"
            description="These commitment blocks are editable in the admin panel and can be repositioned or rewritten as the company grows."
          />
          <div className="commitment-grid">
            {data.commitments.map((item) => (
              <article key={item.id} className={`commitment-card accent-${item.accent}`}>
                <span className="eyebrow">{item.subtitle}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Regional Offices"
            title="Leadership positioned close to active work"
            description="The office directory gives the website the same enterprise-level depth as the reference system, while remaining easy to manage from the backend."
          />
          <div className="offices-grid">
            {data.offices.map((office) => (
              <article key={office.id} className="office-card">
                <h3>{office.name}</h3>
                <p>{office.address}</p>
                <div className="office-meta">
                  <span>{office.region}</span>
                  <span>{office.manager}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
