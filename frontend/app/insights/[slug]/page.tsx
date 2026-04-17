import { notFound } from "next/navigation";

import { getInsightBySlug } from "@/lib/api";

interface InsightDetailPageProps {
  params: { slug: string };
}

export default async function InsightDetailPage({ params }: InsightDetailPageProps) {
  const { slug } = params;
  const insight = await getInsightBySlug(slug);

  if (!insight) {
    notFound();
  }

  const paragraphs = insight.content.split(". ").map((part) => part.trim()).filter(Boolean);

  return (
    <>
      <section
        className="detail-hero"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(7, 15, 28, 0.28), rgba(7, 15, 28, 0.9)), url(${insight.image})` }}
      >
        <div className="container">
          <span className="eyebrow">{insight.category}</span>
          <h1>{insight.title}</h1>
          <p>{insight.excerpt}</p>
          <div className="detail-meta">
            <span>{new Date(insight.published_at).toLocaleDateString()}</span>
            <span>Mandali Builders</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <article className="prose-card article-card">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph.endsWith(".") ? paragraph : `${paragraph}.`}</p>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
