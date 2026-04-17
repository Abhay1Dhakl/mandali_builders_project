import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectCard } from "@/components/project-card";
import { getProjectBySlug, getProjects } from "@/lib/api";

interface ProjectDetailPageProps {
  params: { slug: string };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projects = await getProjects();
  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug && item.sector?.slug === project.sector?.slug)
    .slice(0, 3);

  return (
    <>
      <section
        className="detail-hero"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(7, 15, 28, 0.35), rgba(7, 15, 28, 0.88)), url(${project.image})` }}
      >
        <div className="container">
          <span className="eyebrow">{project.sector?.name ?? "Project"}</span>
          <h1>{project.title}</h1>
          <p>{project.headline}</p>
          <div className="detail-meta">
            <span>{project.location}</span>
            <span>{project.size}</span>
            <span>{project.service_line}</span>
            <span>{project.status}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container detail-grid">
          <div className="prose-card">
            <h2>Project Overview</h2>
            <p>{project.description}</p>
            <h3>Challenge</h3>
            <p>{project.challenge}</p>
            <h3>Solution</h3>
            <p>{project.solution}</p>
            <h3>Impact</h3>
            <p>{project.impact}</p>
          </div>
          <aside className="info-card">
            <span className="eyebrow">Project Facts</span>
            <ul className="info-list">
              <li>
                <strong>Client</strong>
                <span>{project.client_name}</span>
              </li>
              <li>
                <strong>Location</strong>
                <span>{project.location}</span>
              </li>
              <li>
                <strong>Sector</strong>
                <span>{project.sector?.name}</span>
              </li>
              <li>
                <strong>Program</strong>
                <span>{project.size}</span>
              </li>
              <li>
                <strong>Year</strong>
                <span>{project.year_completed}</span>
              </li>
            </ul>
            <Link href="/contact" className="button">
              Discuss a similar project
            </Link>
          </aside>
        </div>
      </section>

      {relatedProjects.length ? (
        <section className="section section-dark">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Related Work</span>
              <h2>More projects in this market segment</h2>
              <p>Use these portfolio pages to demonstrate repeatability, sector depth, and client fit.</p>
            </div>
            <div className="project-grid">
              {relatedProjects.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
