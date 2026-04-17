import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { getOffices, getSiteData } from "@/lib/api";

export default async function ContactPage() {
  const [{ profile }, offices] = await Promise.all([getSiteData(), getOffices()]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>Route new opportunities into the Mandali Builders pipeline</h1>
          <p>
            The contact workflow sends inquiries into the FastAPI backend, where the admin panel can
            review, qualify, and close them.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-layout">
          <div className="info-card">
            <span className="eyebrow">Headquarters</span>
            <h2>{profile.company_name}</h2>
            <p>{profile.address}</p>
            <ul className="info-list">
              <li>
                <strong>Phone</strong>
                <span>{profile.phone}</span>
              </li>
              <li>
                <strong>Email</strong>
                <span>{profile.email}</span>
              </li>
              <li>
                <strong>Primary CTA</strong>
                <span>{profile.hero_primary_cta}</span>
              </li>
            </ul>
          </div>
          <div>
            <SectionHeading
              eyebrow="Get In Touch"
              title="Start a project conversation"
              description="This form is already connected to the backend API. Once the server is running, inquiries will appear in the admin dashboard."
            />
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="Our Offices"
            title="A location layer that reinforces company scale and accessibility"
            description="Office details can be edited directly in the admin panel."
          />
          <div className="offices-grid">
            {offices.map((office) => (
              <article key={office.id} className="office-card">
                <h3>{office.name}</h3>
                <p>{office.address}</p>
                <div className="office-meta">
                  <span>{office.phone}</span>
                  <span>{office.email}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
