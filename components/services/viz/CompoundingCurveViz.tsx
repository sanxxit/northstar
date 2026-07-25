"use client";

import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ----------------------------------------------------------------
   THE COMPOUNDING CURVE — Full-Funnel Marketing
   Two lines: a flat/linear "Point solutions" baseline (muted) and a
   convex "Northstar" curve that accelerates upward week over week.
   The SHAPE is the pitch — it curves up, not straight.
------------------------------------------------------------------- */

// viewBox geometry (units, aspect-locked via preserveAspectRatio)
const W = 640;
const H = 380;
const PAD_L = 40;
const PAD_R = 34;
const PAD_T = 30;
const PAD_B = 44;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

const WEEKS = 12;
const X_LABELS = [1, 3, 6, 9, 12];

// normalized (0..1) plotted values across 12 weeks.
// Point solutions: near-linear, plateauing early (diminishing returns).
const POINT_VALS = [
  0.06, 0.13, 0.19, 0.24, 0.28, 0.31, 0.33, 0.35, 0.36, 0.37, 0.375, 0.38,
];
// Northstar: convex / compounding — each week steeper than the last.
const NORTH_VALS = [
  0.06, 0.09, 0.14, 0.2, 0.28, 0.37, 0.47, 0.58, 0.69, 0.8, 0.91, 1.0,
];

function xAt(i: number) {
  return PAD_L + (i / (WEEKS - 1)) * PLOT_W;
}
function yAt(v: number) {
  return PAD_T + PLOT_H - v * PLOT_H;
}

// smooth cubic path (Catmull-Rom → Bézier) for organic, hand-built curves
function smoothPath(vals: readonly number[]) {
  const pts = vals.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

const POINT_PATH = smoothPath(POINT_VALS);
const NORTH_PATH = smoothPath(NORTH_VALS);
const BASE_Y = PAD_T + PLOT_H;
const NORTH_AREA = `${NORTH_PATH} L ${xAt(WEEKS - 1).toFixed(2)} ${BASE_Y.toFixed(2)} L ${xAt(0).toFixed(2)} ${BASE_Y.toFixed(2)} Z`;

const LEAD_X = xAt(WEEKS - 1);
const LEAD_Y = yAt(NORTH_VALS[WEEKS - 1]);

export function CompoundingCurveViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();

  // path draw-on progress 0 → 1 (drives strokeDashoffset via pathLength=1)
  const [draw, setDraw] = useState(0);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    if (reduced) {
      setDraw(1);
      setLit(true);
      return;
    }
    if (!inView) return;

    const controls = animate(0, 1, {
      duration: 1.15,
      ease: EASE,
      onUpdate: (v) => setDraw(v),
    });
    const t = setTimeout(() => setLit(true), 850);

    return () => {
      controls.stop();
      clearTimeout(t);
    };
  }, [inView, reduced]);

  const showFinal = reduced;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Performance over 12 weeks: point solutions rise linearly then plateau near 38 percent, while the Northstar full-funnel approach compounds — a convex curve that accelerates each week to reach 100 percent."
      className={cn(
        "card relative overflow-hidden rounded-2xl border border-line bg-surface/60 p-5 sm:p-6",
      )}
    >
      {/* ambient accent glow — decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-16 h-52 w-52 rounded-full bg-accent/10 blur-3xl"
      />

      {/* header */}
      <div className="relative z-10 mb-5 flex items-center justify-between gap-3">
        <span className="eyebrow min-w-0 truncate !tracking-[0.16em] font-[family-name:var(--font-mono)] text-faint">
          PERFORMANCE&nbsp;&nbsp;·&nbsp;&nbsp;compounding
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-accent-bright">
          <TrendingUp className="h-3.5 w-3.5" aria-hidden />
          <span className="font-[family-name:var(--font-mono)] text-[0.7rem] tracking-tight tabular-nums">
            W1–W{WEEKS}
          </span>
        </span>
      </div>

      {/* legend */}
      <div
        aria-hidden
        className="relative z-10 mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-[family-name:var(--font-mono)] text-[0.68rem] tracking-tight"
      >
        <span className="inline-flex items-center gap-2 text-accent-bright">
          <span className="inline-block h-[3px] w-5 rounded-full bg-accent-bright shadow-[0_0_8px] shadow-accent/70" />
          Northstar
        </span>
        <span className="inline-flex items-center gap-2 text-faint">
          <span className="inline-block h-[2px] w-5 rounded-full bg-line-strong" />
          Point solutions
        </span>
      </div>

      {/* chart */}
      <div className="relative z-10">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-auto w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="ccv-area" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-accent)"
                stopOpacity="0.34"
              />
              <stop
                offset="100%"
                stopColor="var(--color-accent)"
                stopOpacity="0"
              />
            </linearGradient>
            <linearGradient id="ccv-line" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="var(--color-accent-bright)" />
            </linearGradient>
            <filter id="ccv-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* horizontal hairline gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <line
              key={f}
              x1={PAD_L}
              x2={W - PAD_R}
              y1={PAD_T + PLOT_H * f}
              y2={PAD_T + PLOT_H * f}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          {/* baseline (slightly stronger) */}
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={BASE_Y}
            y2={BASE_Y}
            stroke="rgba(255,255,255,0.11)"
            strokeWidth="1"
          />

          {/* x-axis week labels */}
          {X_LABELS.map((w) => (
            <text
              key={w}
              x={xAt(w - 1)}
              y={H - 16}
              textAnchor="middle"
              className="fill-faint"
              style={{
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "-0.02em",
              }}
            >
              W{w}
            </text>
          ))}

          {/* --- Point solutions: muted, flat/plateauing --- */}
          <motion.path
            d={POINT_PATH}
            fill="none"
            stroke="var(--color-line-strong)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            style={{ pathLength: 1 }}
            strokeDashoffset={showFinal ? 0 : 1 - draw}
          />

          {/* --- Northstar area fill (fades in as line draws) --- */}
          <motion.path
            d={NORTH_AREA}
            fill="url(#ccv-area)"
            initial={false}
            style={{ opacity: showFinal ? 1 : Math.max(0, draw * 1.4 - 0.4) }}
          />

          {/* --- Northstar hero line: convex, compounding --- */}
          <motion.path
            d={NORTH_PATH}
            fill="none"
            stroke="url(#ccv-line)"
            strokeWidth="3.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            style={{ pathLength: 1 }}
            strokeDashoffset={showFinal ? 0 : 1 - draw}
          />

          {/* leading glow dot at the accelerating end — the one highlight */}
          <motion.g
            initial={false}
            animate={
              lit
                ? { opacity: 1, scale: 1 }
                : { opacity: showFinal ? 1 : 0, scale: showFinal ? 1 : 0.4 }
            }
            transition={
              showFinal ? { duration: 0 } : { duration: 0.5, ease: EASE }
            }
            style={{ transformOrigin: `${LEAD_X}px ${LEAD_Y}px` }}
          >
            <circle
              cx={LEAD_X}
              cy={LEAD_Y}
              r="9"
              fill="var(--color-accent)"
              opacity="0.28"
              filter="url(#ccv-glow)"
            />
            <circle
              cx={LEAD_X}
              cy={LEAD_Y}
              r="4.5"
              fill="var(--color-accent-bright)"
              stroke="var(--color-bg)"
              strokeWidth="2"
            />
          </motion.g>
        </svg>
      </div>

      {/* footer caption */}
      <div className="relative z-10 mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="font-[family-name:var(--font-mono)] text-[0.68rem] tracking-tight text-faint">
          week 1
        </span>
        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[0.68rem] tracking-tight text-accent-bright">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-accent-bright shadow-[0_0_8px] shadow-accent/60 animate-pulse-glow"
          />
          accelerating every week
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[0.68rem] tracking-tight text-faint">
          week {WEEKS}
        </span>
      </div>
    </div>
  );
}
