import { SectionHeading } from "@/components/section-heading";
import { getProjects, getSectors } from "@/lib/api";

export default async function SectorsPage() {
  const [sectors, projects] = await Promise.all([getSectors(), getProjects()]);
  const sectorCounts = projects.reduce<Record<string, number>>((accumulator, project) => {
    const key = project.sector?.slug ?? "other";
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Market Sectors</span>
          <h1>Sector pages that show depth, proof, and client understanding</h1>
          <p>
            The platform supports a full sector-based information architecture like the reference
            website, with room to scale content, imagery, and portfolio proof.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Sector Expertise"
            title="A portfolio organized the way enterprise construction clients browse"
            description="Every sector below is editable through the backend and can be expanded as Mandali Builders adds more projects."
          />
          <div className="sector-grid">
            {sectors.map((sector) => (
              <article
                key={sector.id}
                className="sector-card sector-card-large"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(10, 18, 31, 0.08), rgba(10, 18, 31, 0.9)), url(${sector.image})` }}
              >
                <div>
                  <span className="eyebrow">{sector.hero_stat}</span>
                  <h2>{sector.name}</h2>
                  <p>{sector.short_description}</p>
                </div>
                <strong>{sectorCounts[sector.slug] ?? 0} matching projects</strong>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
