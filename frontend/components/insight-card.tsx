import Link from "next/link";

import { Insight } from "@/lib/types";

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <article className="insight-card">
      <div
        className="insight-card-image"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(11, 19, 32, 0.05), rgba(11, 19, 32, 0.72)), url(${insight.image})` }}
      />
      <div className="insight-card-content">
        <span className="eyebrow">{insight.category}</span>
        <h3>{insight.title}</h3>
        <p>{insight.excerpt}</p>
        <Link href={`/insights/${insight.slug}`} className="text-link">
          Read insight
        </Link>
      </div>
    </article>
  );
}
