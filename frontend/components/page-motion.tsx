"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const cardSelector = [
  ".project-card",
  ".insight-card",
  ".service-card",
  ".sector-card",
  ".feature-card",
  ".timeline-card",
  ".office-card",
  ".info-card",
  ".prose-card",
  ".metrics-card",
  ".stat-card",
  ".contact-form",
  ".office-pill",
  ".cta-band-inner",
  ".split-image",
  ".split-content"
].join(", ");

export function PageMotion({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    root.classList.remove("page-motion-ready");

    const sections = Array.from(root.children).filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node.matches("section, .split-section")
    );

    sections.forEach((section, index) => {
      section.classList.add("page-motion-section");
      section.style.setProperty("--motion-order", `${index}`);
    });

    const cards = Array.from(root.querySelectorAll<HTMLElement>(cardSelector));

    cards.forEach((card, index) => {
      card.classList.add("page-motion-card");
      card.classList.remove("is-visible");
      card.style.setProperty("--motion-index", `${index % 6}`);
    });

    const frameId = requestAnimationFrame(() => {
      root.classList.add("page-motion-ready");
    });

    if (typeof IntersectionObserver === "undefined") {
      cards.forEach((card) => card.classList.add("is-visible"));

      return () => {
        cancelAnimationFrame(frameId);
        root.classList.remove("page-motion-ready");
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target as HTMLElement;
          target.classList.add("is-visible");
          observer.unobserve(target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      root.classList.remove("page-motion-ready");
    };
  }, [pathname]);

  return (
    <div ref={rootRef} className="page-motion-root">
      {children}
    </div>
  );
}
