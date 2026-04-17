import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="container narrow">
        <span className="eyebrow">Not Found</span>
        <h1>The requested page is not available.</h1>
        <p>The route may not exist yet, or the linked record may have been removed from the CMS.</p>
        <Link href="/" className="button">
          Return home
        </Link>
      </div>
    </section>
  );
}
