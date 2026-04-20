import Link from "next/link";

import { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <div
        className="project-card-image"
        style={{ backgroundImage: `url(${project.image})` }}
      />
      <div className="project-card-content">
        <div className="project-meta-row">
          <span>{project.sector?.name ?? "Construction"}</span>
          <span>{project.location}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.headline}</p>
        <div className="project-stat-row">
          <strong>{project.size}</strong>
          <strong>{project.year_completed}</strong>
        </div>
        <Link href={`/projects/${project.slug}`} className="text-link">
          View Project
        </Link>
      </div>
    </article>
  );
}
