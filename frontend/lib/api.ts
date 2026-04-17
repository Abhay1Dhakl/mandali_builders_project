import demoData from "../../shared/demo-data.json";
import {
  Commitment,
  CompanyProfile,
  Insight,
  Office,
  Project,
  Sector,
  Service,
  SiteData
} from "./types";

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"
    : process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

type RawProject = Omit<Project, "id" | "sector" | "sector_id"> & {
  sector_slug: string;
};

type RawDemoData = {
  profile: CompanyProfile;
  commitments: Omit<Commitment, "id">[];
  services: Omit<Service, "id">[];
  sectors: Omit<Sector, "id">[];
  projects: RawProject[];
  insights: Omit<Insight, "id">[];
  offices: Omit<Office, "id">[];
};

const rawData = demoData as RawDemoData;

const commitments: Commitment[] = rawData.commitments.map((item, index) => ({
  id: index + 1,
  ...item
}));

const services: Service[] = rawData.services.map((item, index) => ({
  id: index + 1,
  ...item
}));

const sectors: Sector[] = rawData.sectors.map((item, index) => ({
  id: index + 1,
  ...item
}));

const sectorBySlug = new Map(sectors.map((item) => [item.slug, item]));

const projects: Project[] = rawData.projects.map((item, index) => {
  const sector = sectorBySlug.get(item.sector_slug) ?? null;
  return {
    id: index + 1,
    title: item.title,
    slug: item.slug,
    client_name: item.client_name,
    location: item.location,
    sector_id: sector?.id ?? null,
    sector,
    service_line: item.service_line,
    size: item.size,
    year_completed: item.year_completed,
    status: item.status,
    headline: item.headline,
    description: item.description,
    challenge: item.challenge,
    solution: item.solution,
    impact: item.impact,
    image: item.image,
    featured: item.featured
  };
});

const insights: Insight[] = rawData.insights.map((item, index) => ({
  id: index + 1,
  ...item
}));

const offices: Office[] = rawData.offices.map((item, index) => ({
  id: index + 1,
  ...item
}));

export const fallbackSiteData: SiteData = {
  profile: rawData.profile,
  commitments,
  services,
  sectors,
  projects,
  featured_projects: projects.filter((item) => item.featured).slice(0, 4),
  insights,
  featured_insights: insights.filter((item) => item.featured).slice(0, 3),
  offices
};

async function readApi<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getSiteData(): Promise<SiteData> {
  return readApi("/api/public/site", fallbackSiteData);
}

export async function getServices(): Promise<Service[]> {
  return readApi("/api/public/services", fallbackSiteData.services);
}

export async function getSectors(): Promise<Sector[]> {
  return readApi("/api/public/sectors", fallbackSiteData.sectors);
}

export async function getProjects(): Promise<Project[]> {
  return readApi("/api/public/projects", fallbackSiteData.projects);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/projects/${slug}`, {
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error(`Project ${slug} not found`);
    }
    return (await response.json()) as Project;
  } catch {
    return fallbackSiteData.projects.find((item) => item.slug === slug) ?? null;
  }
}

export async function getInsights(): Promise<Insight[]> {
  return readApi("/api/public/insights", fallbackSiteData.insights);
}

export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/insights/${slug}`, {
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error(`Insight ${slug} not found`);
    }
    return (await response.json()) as Insight;
  } catch {
    return fallbackSiteData.insights.find((item) => item.slug === slug) ?? null;
  }
}

export async function getOffices(): Promise<Office[]> {
  return readApi("/api/public/offices", fallbackSiteData.offices);
}

export async function submitInquiry(payload: {
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  message: string;
}): Promise<{ message: string; inquiry_id?: number }> {
  const response = await fetch(`${API_BASE_URL}/api/public/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Unable to submit inquiry");
  }

  return (await response.json()) as { message: string; inquiry_id?: number };
}
