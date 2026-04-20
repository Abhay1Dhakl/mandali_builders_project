"use client";

import type { PointerEvent } from "react";
import { useRef } from "react";

const sceneMetrics = [
  { value: "360°", label: "Site coordination" },
  { value: "BIM", label: "Digital planning" },
  { value: "24/7", label: "Delivery rhythm" }
];

export function ConstructionHeroScene() {
  const sceneRef = useRef<HTMLDivElement>(null);

  const updateScenePerspective = (x: number, y: number) => {
    const scene = sceneRef.current;

    if (!scene) {
      return;
    }

    const rotateY = (x - 0.5) * 14;
    const rotateX = (0.5 - y) * 12;

    scene.style.setProperty("--scene-rotate-x", `${rotateX.toFixed(2)}deg`);
    scene.style.setProperty("--scene-rotate-y", `${rotateY.toFixed(2)}deg`);
    scene.style.setProperty("--scene-glow-x", `${(x * 100).toFixed(2)}%`);
    scene.style.setProperty("--scene-glow-y", `${(y * 100).toFixed(2)}%`);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    updateScenePerspective(x, y);
  };

  const handlePointerLeave = () => {
    updateScenePerspective(0.62, 0.3);
  };

  return (
    <div className="construction-scene-frame">
      <div className="construction-scene-intro">
        <span>Interactive Build Model</span>
        <strong>Construction Visualization</strong>
      </div>

      <div
        ref={sceneRef}
        className="construction-scene"
        role="img"
        aria-label="Animated 3D construction site illustration"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className="construction-scene-glow construction-scene-glow--primary" />
        <div className="construction-scene-glow construction-scene-glow--secondary" />
        <div className="construction-scene-orbit construction-scene-orbit--one" />
        <div className="construction-scene-orbit construction-scene-orbit--two" />

        <div className="construction-scene-card construction-scene-card--status">
          <span>Live sequence</span>
          <strong>Structural frame rising</strong>
        </div>

        <div className="construction-scene-card construction-scene-card--metrics">
          {sceneMetrics.map((metric) => (
            <div key={metric.label} className="construction-metric">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>

        <div className="construction-scene-stage">
          <div className="construction-stage-floor" />
          <div className="construction-stage-grid" />
          <div className="construction-stage-runway" />

          <div className="construction-platform construction-platform--main" />
          <div className="construction-platform construction-platform--east" />

          <div className="construction-tower construction-tower--west">
            <span className="construction-window-band construction-window-band--a" />
            <span className="construction-window-band construction-window-band--b" />
            <span className="construction-window-band construction-window-band--c" />
          </div>

          <div className="construction-tower construction-tower--center">
            <span className="construction-window-band construction-window-band--a" />
            <span className="construction-window-band construction-window-band--b" />
            <span className="construction-window-band construction-window-band--c" />
            <span className="construction-window-band construction-window-band--d" />
          </div>

          <div className="construction-tower construction-tower--east">
            <span className="construction-window-band construction-window-band--a" />
            <span className="construction-window-band construction-window-band--b" />
          </div>

          <div className="construction-core" />
          <div className="construction-load" />

          <div className="construction-crane">
            <span className="construction-crane-mast" />
            <span className="construction-crane-arm" />
            <span className="construction-crane-counterweight" />
            <span className="construction-crane-cable" />
            <span className="construction-crane-hook" />
          </div>

          <div className="construction-beam construction-beam--one" />
          <div className="construction-beam construction-beam--two" />
          <div className="construction-column construction-column--one" />
          <div className="construction-column construction-column--two" />
          <div className="construction-signal construction-signal--one" />
          <div className="construction-signal construction-signal--two" />
        </div>
      </div>
    </div>
  );
}
