export type Accent = "amber" | "green" | "blue" | "terracotta" | string;

export interface CompanyProfile {
  id?: number;
  company_name: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  overview: string;
  vision: string;
  years_experience: number;
  completed_projects: number;
  annual_volume: string;
  client_retention: string;
  phone: string;
  email: string;
  address: string;
  headquarters: string;
  hero_primary_cta: string;
  hero_secondary_cta: string;
}

export interface Commitment {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  accent: Accent;
  display_order: number;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  detailed_description: string;
  icon: string;
  display_order: number;
}

export interface Sector {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  hero_stat: string;
  image: string;
  display_order: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  client_name: string;
  location: string;
  sector_id?: number | null;
  sector: Sector | null;
  service_line: string;
  size: string;
  year_completed: number;
  status: string;
  headline: string;
  description: string;
  challenge: string;
  solution: string;
  impact: string;
  image: string;
  featured: boolean;
}

export interface Insight {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  published_at: string;
  featured: boolean;
}

export interface Office {
  id: number;
  name: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  region: string;
  featured: boolean;
}

export interface Inquiry {
  id: number;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  message: string;
  status: string;
  created_at: string;
}

export interface DashboardStats {
  total_services: number;
  total_sectors: number;
  total_projects: number;
  total_insights: number;
  total_offices: number;
  open_inquiries: number;
}

export interface SiteData {
  profile: CompanyProfile;
  commitments: Commitment[];
  services: Service[];
  sectors: Sector[];
  projects: Project[];
  featured_projects: Project[];
  insights: Insight[];
  featured_insights: Insight[];
  offices: Office[];
}
