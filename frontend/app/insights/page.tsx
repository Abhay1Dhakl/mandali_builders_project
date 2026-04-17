import { InsightCard } from "@/components/insight-card";
import { SectionHeading } from "@/components/section-heading";
import { getInsights } from "@/lib/api";

export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">News and Insights</span>
          <h1>A content layer that keeps the website credible and current</h1>
          <p>
            The backend includes article management so the client can publish updates, market
            insight, and thought leadership without developer intervention.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Latest Articles"
            title="Insight entries with flexible publishing controls"
            description="Each article supports editable titles, excerpts, body copy, hero images, categories, and publish dates."
          />
          <div className="insight-grid">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
