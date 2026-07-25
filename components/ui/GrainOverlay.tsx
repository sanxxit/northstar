/**
 * Fixed full-screen film-grain overlay (~4% opacity). Pure CSS/SVG, no JS.
 * Sits above everything but ignores pointer events.
 */
const NOISE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.04] mix-blend-overlay"
      style={{
        backgroundImage: `url("${NOISE}")`,
        backgroundSize: "140px 140px",
      }}
    />
  );
}
