import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { getProjects } from "@/lib/api";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Projects</span>
          <h1>Portfolio pages designed to support serious business development</h1>
          <p>
            Each project entry includes sector context, client, size, status, narrative, and impact
            so the website feels substantial from the first demo.
          </p>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <SectionHeading
            eyebrow="Project Portfolio"
            title="Featured and active work across multiple sectors"
            description="Project records are fully editable from the admin panel and can be expanded without touching code."
          />
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
