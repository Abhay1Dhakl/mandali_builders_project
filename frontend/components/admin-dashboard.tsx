"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Commitment, CompanyProfile, DashboardStats, Inquiry, Insight, Office, Project, Sector, Service } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";
const TOKEN_STORAGE_KEY = "mandali_admin_token";

type TabKey =
  | "profile"
  | "commitments"
  | "services"
  | "sectors"
  | "projects"
  | "insights"
  | "offices"
  | "inquiries";

type InputType = "text" | "textarea" | "number" | "checkbox" | "select" | "datetime-local" | "email";

type DraftValue = string | number | boolean;
type DraftRecord = Record<string, DraftValue>;
type ProfileValue = CompanyProfile[keyof CompanyProfile];
type EditableTab = Exclude<TabKey, "profile" | "inquiries">;
type EditableResource = Commitment | Service | Sector | Project | Insight | Office;

interface FieldConfig {
  name: string;
  label: string;
  type: InputType;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
}

interface ResourceState {
  commitments: Commitment[];
  services: Service[];
  sectors: Sector[];
  projects: Project[];
  insights: Insight[];
  offices: Office[];
  inquiries: Inquiry[];
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "profile", label: "Profile" },
  { key: "commitments", label: "Commitments" },
  { key: "services", label: "Services" },
  { key: "sectors", label: "Sectors" },
  { key: "projects", label: "Projects" },
  { key: "insights", label: "Insights" },
  { key: "offices", label: "Offices" },
  { key: "inquiries", label: "Inquiries" }
];

const emptyResources: ResourceState = {
  commitments: [],
  services: [],
  sectors: [],
  projects: [],
  insights: [],
  offices: [],
  inquiries: []
};

const defaultProfile: CompanyProfile = {
  company_name: "",
  tagline: "",
  hero_title: "",
  hero_subtitle: "",
  overview: "",
  vision: "",
  years_experience: 0,
  completed_projects: 0,
  annual_volume: "",
  client_retention: "",
  phone: "",
  email: "",
  address: "",
  headquarters: "",
  hero_primary_cta: "",
  hero_secondary_cta: ""
};

function getEmptyDrafts(defaultSectorId = 0): Record<EditableTab, DraftRecord> {
  return {
    commitments: {
      title: "",
      subtitle: "",
      description: "",
      accent: "amber",
      display_order: 1
    },
    services: {
      name: "",
      slug: "",
      short_description: "",
      detailed_description: "",
      icon: "",
      display_order: 1
    },
    sectors: {
      name: "",
      slug: "",
      short_description: "",
      hero_stat: "",
      image: "",
      display_order: 1
    },
    projects: {
      title: "",
      slug: "",
      client_name: "",
      location: "",
      sector_id: defaultSectorId,
      service_line: "",
      size: "",
      year_completed: new Date().getFullYear(),
      status: "Completed",
      headline: "",
      description: "",
      challenge: "",
      solution: "",
      impact: "",
      image: "",
      featured: true
    },
    insights: {
      title: "",
      slug: "",
      category: "",
      excerpt: "",
      content: "",
      image: "",
      published_at: new Date().toISOString().slice(0, 16),
      featured: true
    },
    offices: {
      name: "",
      city: "",
      country: "Nepal",
      address: "",
      phone: "",
      email: "",
      manager: "",
      region: "",
      featured: true
    }
  };
}

function toInputDateTime(value: string) {
  return value ? value.slice(0, 16) : "";
}

function getResourceTitle(item: EditableResource) {
  return "title" in item ? item.title : item.name;
}

function getResourceSubtitle(item: EditableResource) {
  if ("subtitle" in item) {
    return item.subtitle;
  }
  if ("category" in item) {
    return item.category;
  }
  if ("region" in item) {
    return item.region;
  }
  if ("location" in item) {
    return item.location;
  }
  if ("slug" in item) {
    return item.slug;
  }
  return "";
}

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [token, setToken] = useState("");
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [profile, setProfile] = useState<CompanyProfile>(defaultProfile);
  const [resources, setResources] = useState<ResourceState>(emptyResources);
  const [drafts, setDrafts] = useState(getEmptyDrafts());
  const [editingIds, setEditingIds] = useState<Record<string, number | null>>({
    commitments: null,
    services: null,
    sectors: null,
    projects: null,
    insights: null,
    offices: null
  });
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!savedToken) {
      router.replace("/admin/login");
      return;
    }
    setToken(savedToken);
  }, [router]);

  useEffect(() => {
    if (!token) {
      return;
    }
    void loadData(token);
  }, [token]);

  async function adminFetch(path: string, init?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      }
    });

    if (response.status === 401) {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      router.replace("/admin/login");
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response;
  }

  async function loadData(authToken: string) {
    setLoading(true);
    setError("");

    try {
      const headers = {
        Authorization: `Bearer ${authToken}`
      };

      const [
        dashboardResponse,
        profileResponse,
        commitmentsResponse,
        servicesResponse,
        sectorsResponse,
        projectsResponse,
        insightsResponse,
        officesResponse,
        inquiriesResponse
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/dashboard`, { headers, cache: "no-store" }),
        fetch(`${API_BASE_URL}/api/admin/profile`, { headers, cache: "no-store" }),
        fetch(`${API_BASE_URL}/api/admin/commitments`, { headers, cache: "no-store" }),
        fetch(`${API_BASE_URL}/api/admin/services`, { headers, cache: "no-store" }),
        fetch(`${API_BASE_URL}/api/admin/sectors`, { headers, cache: "no-store" }),
        fetch(`${API_BASE_URL}/api/admin/projects`, { headers, cache: "no-store" }),
        fetch(`${API_BASE_URL}/api/admin/insights`, { headers, cache: "no-store" }),
        fetch(`${API_BASE_URL}/api/admin/offices`, { headers, cache: "no-store" }),
        fetch(`${API_BASE_URL}/api/admin/inquiries`, { headers, cache: "no-store" })
      ]);

      const responses = [
        dashboardResponse,
        profileResponse,
        commitmentsResponse,
        servicesResponse,
        sectorsResponse,
        projectsResponse,
        insightsResponse,
        officesResponse,
        inquiriesResponse
      ];

      if (responses.some((response) => response.status === 401)) {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        router.replace("/admin/login");
        return;
      }

      if (responses.some((response) => !response.ok)) {
        throw new Error("Unable to load admin data");
      }

      const [
        dashboardData,
        profileData,
        commitmentsData,
        servicesData,
        sectorsData,
        projectsData,
        insightsData,
        officesData,
        inquiriesData
      ] = await Promise.all(responses.map(async (response) => response.json()));

      setDashboard(dashboardData as DashboardStats);
      const { id: _id, ...profileWithoutId } = profileData as CompanyProfile & { id?: number };

      setProfile(profileWithoutId);
      setResources({
        commitments: commitmentsData as Commitment[],
        services: servicesData as Service[],
        sectors: sectorsData as Sector[],
        projects: projectsData as Project[],
        insights: insightsData as Insight[],
        offices: officesData as Office[],
        inquiries: inquiriesData as Inquiry[]
      });
      setDrafts(getEmptyDrafts((sectorsData as Sector[])[0]?.id ?? 0));
    } catch {
      setError("Admin data could not be loaded. Start the backend to use the control panel.");
    } finally {
      setLoading(false);
    }
  }

  function updateProfileField(name: keyof CompanyProfile, value: ProfileValue) {
    setProfile((current) => ({ ...current, [name]: value }));
  }

  function updateDraft(tab: EditableTab, name: string, value: DraftValue) {
    setDrafts((current) => ({
      ...current,
      [tab]: {
        ...current[tab],
        [name]: value
      }
    }));
  }

  function resetDraft(tab: EditableTab) {
    setDrafts((current) => ({
      ...current,
      [tab]: getEmptyDrafts(resources.sectors[0]?.id ?? 0)[tab]
    }));
    setEditingIds((current) => ({ ...current, [tab]: null }));
  }

  function startEdit(tab: EditableTab, item: EditableResource) {
    const nextDraft: DraftRecord = {};
    Object.entries(item).forEach(([key, value]) => {
      if (key === "id" || key === "sector") {
        return;
      }
      if (typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
        nextDraft[key] =
          key === "published_at" && typeof value === "string" ? toInputDateTime(value) : value;
      }
    });
    setEditingIds((current) => ({ ...current, [tab]: item.id }));
    setDrafts((current) => ({ ...current, [tab]: nextDraft }));
    setActiveTab(tab);
  }

  async function saveProfile() {
    setWorking(true);
    setMessage("");
    setError("");

    try {
      await adminFetch("/api/admin/profile", {
        method: "PUT",
        body: JSON.stringify(profile)
      });
      setMessage("Profile updated.");
      await loadData(token);
    } catch {
      setError("Profile update failed.");
    } finally {
      setWorking(false);
    }
  }

  function normalizePayload(tab: EditableTab, draft: DraftRecord) {
    const payload: Record<string, DraftValue | null> = {};

    Object.entries(draft).forEach(([key, value]) => {
      if (key === "published_at" && typeof value === "string") {
        payload[key] = new Date(value).toISOString();
        return;
      }
      payload[key] = value;
    });

    if (tab === "projects" && !payload.sector_id) {
      payload.sector_id = null;
    }

    return payload;
  }

  async function saveResource(tab: EditableTab) {
    setWorking(true);
    setMessage("");
    setError("");

    const endpoint = `/api/admin/${tab}`;
    const editingId = editingIds[tab];
    const url = editingId ? `${endpoint}/${editingId}` : endpoint;
    const method = editingId ? "PUT" : "POST";

    try {
      await adminFetch(url, {
        method,
        body: JSON.stringify(normalizePayload(tab, drafts[tab]))
      });
      setMessage(`${tabs.find((item) => item.key === tab)?.label} saved.`);
      resetDraft(tab);
      await loadData(token);
    } catch {
      setError("Save failed.");
    } finally {
      setWorking(false);
    }
  }

  async function deleteResource(tab: Exclude<TabKey, "profile">, id: number) {
    setWorking(true);
    setMessage("");
    setError("");

    try {
      await adminFetch(`/api/admin/${tab}/${id}`, { method: "DELETE" });
      setMessage("Record deleted.");
      await loadData(token);
    } catch {
      setError("Delete failed.");
    } finally {
      setWorking(false);
    }
  }

  async function updateInquiryStatus(id: number, status: string) {
    setWorking(true);
    setMessage("");
    setError("");

    try {
      await adminFetch(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });
      setMessage("Inquiry updated.");
      await loadData(token);
    } catch {
      setError("Inquiry update failed.");
    } finally {
      setWorking(false);
    }
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    router.replace("/admin/login");
  }

  const fieldConfigs: Record<EditableTab, FieldConfig[]> = {
    commitments: [
      { name: "title", label: "Title", type: "text" },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "accent",
        label: "Accent",
        type: "select",
        options: [
          { label: "Amber", value: "amber" },
          { label: "Green", value: "green" },
          { label: "Blue", value: "blue" },
          { label: "Terracotta", value: "terracotta" }
        ]
      },
      { name: "display_order", label: "Display Order", type: "number" }
    ],
    services: [
      { name: "name", label: "Name", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "short_description", label: "Short Description", type: "textarea" },
      { name: "detailed_description", label: "Detailed Description", type: "textarea" },
      { name: "icon", label: "Icon Label", type: "text" },
      { name: "display_order", label: "Display Order", type: "number" }
    ],
    sectors: [
      { name: "name", label: "Name", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "short_description", label: "Short Description", type: "textarea" },
      { name: "hero_stat", label: "Hero Stat", type: "text" },
      { name: "image", label: "Image URL", type: "text" },
      { name: "display_order", label: "Display Order", type: "number" }
    ],
    projects: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "client_name", label: "Client", type: "text" },
      { name: "location", label: "Location", type: "text" },
      {
        name: "sector_id",
        label: "Sector",
        type: "select",
        options: resources.sectors.map((item) => ({ label: item.name, value: item.id }))
      },
      { name: "service_line", label: "Service Line", type: "text" },
      { name: "size", label: "Size", type: "text" },
      { name: "year_completed", label: "Year", type: "number" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Completed", value: "Completed" },
          { label: "In Progress", value: "In Progress" },
          { label: "Upcoming", value: "Upcoming" }
        ]
      },
      { name: "headline", label: "Headline", type: "textarea" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "challenge", label: "Challenge", type: "textarea" },
      { name: "solution", label: "Solution", type: "textarea" },
      { name: "impact", label: "Impact", type: "textarea" },
      { name: "image", label: "Image URL", type: "text" },
      { name: "featured", label: "Featured", type: "checkbox" }
    ],
    insights: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "Content", type: "textarea" },
      { name: "image", label: "Image URL", type: "text" },
      { name: "published_at", label: "Publish Date", type: "datetime-local" },
      { name: "featured", label: "Featured", type: "checkbox" }
    ],
    offices: [
      { name: "name", label: "Name", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "country", label: "Country", type: "text" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "manager", label: "Manager", type: "text" },
      { name: "region", label: "Region", type: "text" },
      { name: "featured", label: "Featured", type: "checkbox" }
    ]
  };

  function renderInput(
    tab: EditableTab,
    field: FieldConfig,
    value: DraftValue | undefined
  ) {
    if (field.type === "textarea") {
      return (
        <textarea
          rows={4}
          value={String(value ?? "")}
          onChange={(event) => updateDraft(tab, field.name, event.target.value)}
        />
      );
    }

    if (field.type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => updateDraft(tab, field.name, event.target.checked)}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          value={String(value ?? "")}
          onChange={(event) =>
            updateDraft(
              tab,
              field.name,
              field.name === "sector_id" ? Number(event.target.value) : event.target.value
            )
          }
        >
          {field.options?.map((option) => (
            <option key={`${field.name}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type === "number" ? "number" : field.type}
        value={field.type === "number" ? Number(value ?? 0) : String(value ?? "")}
        onChange={(event) =>
          updateDraft(
            tab,
            field.name,
            field.type === "number" ? Number(event.target.value) : event.target.value
          )
        }
      />
    );
  }

  if (loading) {
    return <section className="admin-dashboard-state">Loading admin workspace...</section>;
  }

  return (
    <section className="admin-dashboard">
      <div className="admin-hero">
        <div>
          <span className="eyebrow">Admin Panel</span>
          <h1>Mandali Builders content control</h1>
          <p>Update the public website and manage incoming leads from one workspace.</p>
        </div>
        <div className="admin-hero-actions">
          <button className="button button-secondary" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>

      {dashboard ? (
        <div className="stats-grid">
          <div className="stat-card">
            <span>Projects</span>
            <strong>{dashboard.total_projects}</strong>
          </div>
          <div className="stat-card">
            <span>Services</span>
            <strong>{dashboard.total_services}</strong>
          </div>
          <div className="stat-card">
            <span>Sectors</span>
            <strong>{dashboard.total_sectors}</strong>
          </div>
          <div className="stat-card">
            <span>Open Inquiries</span>
            <strong>{dashboard.open_inquiries}</strong>
          </div>
        </div>
      ) : null}

      {message ? <div className="status-banner success">{message}</div> : null}
      {error ? <div className="status-banner error">{error}</div> : null}

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? "active" : ""}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" ? (
        <div className="admin-panel">
          <div className="admin-form-grid">
            {Object.entries(profile).map(([key, value]) => (
              <label key={key}>
                {key.replaceAll("_", " ")}
                {typeof value === "number" ? (
                  <input
                    type="number"
                    value={value}
                    onChange={(event) =>
                      updateProfileField(key as keyof CompanyProfile, Number(event.target.value))
                    }
                  />
                ) : key === "overview" || key === "vision" || key === "hero_subtitle" ? (
                  <textarea
                    rows={4}
                    value={String(value ?? "")}
                    onChange={(event) =>
                      updateProfileField(key as keyof CompanyProfile, event.target.value)
                    }
                  />
                ) : (
                  <input
                    value={String(value ?? "")}
                    onChange={(event) =>
                      updateProfileField(key as keyof CompanyProfile, event.target.value)
                    }
                  />
                )}
              </label>
            ))}
          </div>
          <button className="button" onClick={saveProfile} disabled={working}>
            {working ? "Saving..." : "Save profile"}
          </button>
        </div>
      ) : null}

      {activeTab !== "profile" && activeTab !== "inquiries" ? (
        <div className="admin-resource-layout">
          <div className="admin-panel">
            <h2>{tabs.find((item) => item.key === activeTab)?.label}</h2>
            <div className="admin-form-grid">
              {fieldConfigs[activeTab].map((field) => (
                <label key={field.name}>
                  {field.label}
                  {renderInput(activeTab, field, drafts[activeTab][field.name])}
                </label>
              ))}
            </div>
            <div className="form-actions">
              <button className="button" onClick={() => saveResource(activeTab)} disabled={working}>
                {working
                  ? "Saving..."
                  : editingIds[activeTab]
                    ? "Update record"
                    : "Create record"}
              </button>
              <button
                className="button button-secondary"
                onClick={() => resetDraft(activeTab)}
                disabled={working}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="admin-panel">
            <h2>Existing records</h2>
            <div className="data-table">
              {resources[activeTab].map((item) => (
                <div key={item.id} className="data-row">
                  <div>
                    <strong>{getResourceTitle(item)}</strong>
                    <p>{getResourceSubtitle(item)}</p>
                  </div>
                  <div className="row-actions">
                    <button className="button-link" onClick={() => startEdit(activeTab, item)}>
                      Edit
                    </button>
                    <button
                      className="button-link danger"
                      onClick={() => deleteResource(activeTab, item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "inquiries" ? (
        <div className="admin-panel">
          <h2>Client inquiries</h2>
          <div className="data-table">
            {resources.inquiries.map((item) => (
              <div key={item.id} className="inquiry-card">
                <div>
                  <strong>{item.full_name}</strong>
                  <p>
                    {item.company_name} · {item.inquiry_type}
                  </p>
                  <p>{item.message}</p>
                </div>
                <div className="inquiry-actions">
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  <select
                    value={item.status}
                    onChange={(event) => updateInquiryStatus(item.id, event.target.value)}
                  >
                    <option>New</option>
                    <option>In Review</option>
                    <option>Qualified</option>
                    <option>Closed</option>
                  </select>
                  <button
                    className="button-link danger"
                    onClick={() => deleteResource("inquiries", item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
