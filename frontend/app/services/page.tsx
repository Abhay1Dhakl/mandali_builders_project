import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { getServices } from "@/lib/api";

const processSteps = [
  "Align business goals, scope, schedule, and budget in preconstruction.",
  "Package procurement and field logistics around real delivery risk.",
  "Lead construction with live reporting, quality controls, and safety discipline.",
  "Commission, hand over, and close out with operational readiness in view."
];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Services</span>
          <h1>Delivery models built around complex construction outcomes</h1>
          <p>
            Each service line is structured so Mandali Builders can present itself with the same
            confidence and content depth as a top-tier construction brand.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="service-grid">
            {services.map((service, index) => (
              <article key={service.id} className="service-card tall">
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

      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="How We Deliver"
            title="A clear execution approach from planning through turnover"
            description="The flow below gives the services section a strong narrative spine instead of reading like a static brochure."
          />
          <div className="timeline-grid">
            {processSteps.map((step, index) => (
              <article key={step} className="timeline-card">
                <span>0{index + 1}</span>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band">
          <div>
            <span className="eyebrow">Need delivery support?</span>
            <h2>Use the contact flow to route new opportunities straight into the admin panel.</h2>
          </div>
          <Link href="/contact" className="button">
            Request a consultation
          </Link>
        </div>
      </section>
    </>
  );
}
