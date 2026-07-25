"use client";

import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---- sample data ----------------------------------------------------------
// gently climbing sparkline series (normalized-ish revenue-per-week values)
const SERIES = [18, 22, 20, 28, 26, 34, 33, 41, 44, 52, 58, 66];

const STATS = [
  { label: "Spend", value: "$124k" },
  { label: "Pipeline", value: "$2.1M" },
  { label: "CAC", value: "-28%" },
] as const;

// sparkline geometry (viewBox units)
const W = 320;
const H = 96;
const PAD_X = 6;
const PAD_TOP = 12;
const PAD_BOTTOM = 8;
const PLOT_W = W - PAD_X * 2;
const PLOT_H = H - PAD_TOP - PAD_BOTTOM;

const MIN = Math.min(...SERIES);
const MAX = Math.max(...SERIES);
const RANGE = MAX - MIN || 1;

const POINTS = SERIES.map((v, i) => {
  const x = PAD_X + (i / (SERIES.length - 1)) * PLOT_W;
  const y = PAD_TOP + PLOT_H - ((v - MIN) / RANGE) * PLOT_H;
  return { x, y };
});

const LINE_PATH = POINTS.map(
  (p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`,
).join(" ");

const BASELINE_Y = PAD_TOP + PLOT_H;
const AREA_PATH = `${LINE_PATH} L ${POINTS[POINTS.length - 1].x.toFixed(1)} ${BASELINE_Y.toFixed(
  1,
)} L ${POINTS[0].x.toFixed(1)} ${BASELINE_Y.toFixed(1)} Z`;

const LAST = POINTS[POINTS.length - 1];

// hero value
const TARGET = 3.4;

export function OneNumberViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();

  const [display, setDisplay] = useState(reduced ? TARGET : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(TARGET);
      return;
    }
    const controls = animate(0, TARGET, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, reduced]);

  const drawn = reduced || inView;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Blended ROAS is 3.4x and climbing. Spend $124k, pipeline $2.1M, and CAC down 28 percent."
      className={cn(
        "card relative overflow-hidden rounded-2xl border border-line bg-surface/60",
        "p-5 sm:p-6",
      )}
    >
      {/* soft accent glow — one, restrained */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
      />

      {/* header — mono caption */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-faint">
          Is everything okay?
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-accent-bright shadow-[0_0_10px_2px] shadow-accent/60 animate-pulse-glow"
          />
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-muted">
            live
          </span>
        </span>
      </div>

      {/* hero number */}
      <div className="relative z-10 mt-6">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-faint">
          Blended ROAS
        </p>
        <div className="mt-2 flex items-end gap-3">
          <motion.span
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={drawn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-display text-6xl font-semibold leading-none tracking-tight text-accent-bright text-shadow-glow tabular-nums sm:text-7xl"
          >
            {display.toFixed(1)}x
          </motion.span>
          <motion.span
            initial={reduced ? false : { opacity: 0 }}
            animate={drawn ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
            className="mb-1 inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-xs text-muted"
          >
            <TrendingUp className="h-3.5 w-3.5 text-accent-bright" aria-hidden />
            <span className="text-accent-bright">+12%</span>
            <span className="text-faint">vs Q3</span>
          </motion.span>
        </div>
      </div>

      {/* sparkline */}
      <div className="relative z-10 mt-5">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="aspect-[320/96] h-auto w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="onvArea" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-accent)"
                stopOpacity="0.22"
              />
              <stop
                offset="100%"
                stopColor="var(--color-accent)"
                stopOpacity="0"
              />
            </linearGradient>
            <linearGradient id="onvLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="var(--color-accent-bright)" />
            </linearGradient>
          </defs>

          {/* soft area fill under the line */}
          <motion.path
            d={AREA_PATH}
            fill="url(#onvArea)"
            initial={reduced ? false : { opacity: 0 }}
            animate={drawn ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
          />

          {/* climbing line, drawn on via pathLength */}
          <motion.path
            d={LINE_PATH}
            fill="none"
            stroke="url(#onvLine)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={reduced ? false : { pathLength: 0, opacity: 0.4 }}
            animate={drawn ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          />

          {/* leading dot on the latest value */}
          <motion.circle
            cx={LAST.x}
            cy={LAST.y}
            r="3.2"
            fill="var(--color-accent-bright)"
            vectorEffect="non-scaling-stroke"
            initial={reduced ? false : { opacity: 0, scale: 0 }}
            animate={drawn ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, ease: EASE, delay: 1.05 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        </svg>
      </div>

      {/* three supporting stats */}
      <div className="relative z-10 mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={drawn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: 0.7 + i * 0.1 }}
            className="bg-surface px-3 py-3 sm:px-4"
          >
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-faint">
              {s.label}
            </p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-base font-medium tabular-nums text-ink sm:text-lg">
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
