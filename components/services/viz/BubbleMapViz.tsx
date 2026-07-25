"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---- plot geometry (viewBox units) ----
const W = 340;
const H = 260;
const PAD_L = 34;
const PAD_R = 20;
const PAD_T = 20;
const PAD_B = 34;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

// map a 0..1 domain value → svg coords (y inverted so higher = up)
const sx = (v: number) => PAD_L + v * PLOT_W;
const sy = (v: number) => PAD_T + (1 - v) * PLOT_H;

// ---- sample data ----
// x = estimated spend (0..1), y = engagement (0..1), r = share of voice
type Competitor = { id: string; x: number; y: number; sov: number };

const COMPETITORS: readonly Competitor[] = [
  { id: "Atlas", x: 0.74, y: 0.58, sov: 26 },
  { id: "Meridian", x: 0.82, y: 0.5, sov: 21 },
  { id: "Vantage", x: 0.68, y: 0.66, sov: 17 },
  { id: "Nimbus", x: 0.79, y: 0.42, sov: 13 },
  { id: "Corva", x: 0.64, y: 0.52, sov: 9 },
  { id: "Pallas", x: 0.88, y: 0.6, sov: 7 },
];

// the empty region — low spend, high engagement (the whitespace)
const OPENING = { x: 0.24, y: 0.78 };

// share-of-voice → bubble radius (viewBox units)
const R_MIN = 8;
const R_MAX = 26;
const SOV_MIN = Math.min(...COMPETITORS.map((c) => c.sov));
const SOV_MAX = Math.max(...COMPETITORS.map((c) => c.sov));
const rOf = (sov: number) =>
  R_MIN + ((sov - SOV_MIN) / (SOV_MAX - SOV_MIN)) * (R_MAX - R_MIN);

const OPENING_R = 28;

export function BubbleMapViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const on = reduced ? true : inView;

  const openingCx = sx(OPENING.x);
  const openingCy = sy(OPENING.y);

  // opening ring appears after the last bubble staggers in
  const lastBubbleDelay = 0.2 + (COMPETITORS.length - 1) * 0.09;
  const ringDelay = reduced ? 0 : lastBubbleDelay + 0.35;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Competitor bubble map plotting estimated spend against engagement. Six rivals cluster in the high-spend, mid-engagement region, sized by share of voice. A dashed accent ring marks an open low-competition, high-engagement region labelled 'Your opening'."
      className={cn(
        "card relative overflow-hidden rounded-2xl p-5 sm:p-6",
        "border border-line bg-surface/60",
      )}
    >
      {/* ambient texture + faint accent bloom over the whitespace */}
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 opacity-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-accent/10 blur-3xl"
      />

      {/* header */}
      <div className="relative z-10 mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-accent-bright shadow-[0_0_10px_2px] shadow-accent/60"
          />
          <span className="eyebrow !tracking-[0.16em] text-faint">
            Competitor map
          </span>
        </div>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-faint">
          Share of voice
        </span>
      </div>

      {/* the plot */}
      <div className="relative z-10">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <radialGradient id="bmOpeningFill" cx="50%" cy="50%" r="50%">
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
            </radialGradient>
            <radialGradient id="bmBubbleFill" cx="38%" cy="34%" r="70%">
              <stop
                offset="0%"
                stopColor="rgba(255,255,255,0.10)"
                stopOpacity="1"
              />
              <stop
                offset="100%"
                stopColor="rgba(255,255,255,0.02)"
                stopOpacity="1"
              />
            </radialGradient>
          </defs>

          {/* --- axis frame --- */}
          <line
            x1={PAD_L}
            y1={PAD_T}
            x2={PAD_L}
            y2={PAD_T + PLOT_H}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1"
          />
          <line
            x1={PAD_L}
            y1={PAD_T + PLOT_H}
            x2={W - PAD_R}
            y2={PAD_T + PLOT_H}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1"
          />

          {/* faint inner gridlines */}
          {[0.25, 0.5, 0.75].map((f) => (
            <g key={f}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={PAD_T + PLOT_H * f}
                y2={PAD_T + PLOT_H * f}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
              <line
                x1={PAD_L + PLOT_W * f}
                x2={PAD_L + PLOT_W * f}
                y1={PAD_T}
                y2={PAD_T + PLOT_H}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* --- axis labels (mono) --- */}
          <text
            x={PAD_L}
            y={H - 8}
            textAnchor="start"
            className="fill-faint"
            style={{
              fontSize: "9px",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.04em",
            }}
          >
            Estimated spend →
          </text>
          <text
            x={-(PAD_T + PLOT_H / 2)}
            y={11}
            transform="rotate(-90)"
            textAnchor="middle"
            className="fill-faint"
            style={{
              fontSize: "9px",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.04em",
            }}
          >
            Engagement →
          </text>

          {/* --- competitor bubbles (muted, hairline) --- */}
          {COMPETITORS.map((c, i) => {
            const cx = sx(c.x);
            const cy = sy(c.y);
            const r = rOf(c.sov);
            return (
              <motion.g
                key={c.id}
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                animate={on ? { scale: 1, opacity: 1 } : {}}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: reduced ? 0 : 0.2 + i * 0.09,
                }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              >
                <circle cx={cx} cy={cy} r={r} fill="url(#bmBubbleFill)" />
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="1"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r="1.4"
                  fill="rgba(255,255,255,0.35)"
                />
                {/* small mono sov label inside larger bubbles */}
                {r > 15 && (
                  <text
                    x={cx}
                    y={cy + r + 11}
                    textAnchor="middle"
                    className="fill-muted"
                    style={{
                      fontSize: "8px",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {c.sov}%
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* --- the opening: dashed accent ring, drawn + pulsing last --- */}
          <motion.g
            initial={reduced ? false : { opacity: 0 }}
            animate={on ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: ringDelay }}
          >
            {/* soft accent bloom */}
            <circle
              cx={openingCx}
              cy={openingCy}
              r={OPENING_R + 14}
              fill="url(#bmOpeningFill)"
            />

            {/* pulsing halo ring (loops after it lands) */}
            {!reduced && (
              <motion.circle
                cx={openingCx}
                cy={openingCy}
                r={OPENING_R}
                fill="none"
                stroke="var(--color-accent-bright)"
                strokeWidth="1"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={
                  on
                    ? { scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }
                    : {}
                }
                transition={{
                  duration: 2.6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: ringDelay + 0.4,
                }}
                style={{ transformOrigin: `${openingCx}px ${openingCy}px` }}
              />
            )}

            {/* dashed accent ring, drawn on */}
            <motion.circle
              cx={openingCx}
              cy={openingCy}
              r={OPENING_R}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.6"
              strokeDasharray="4 4"
              strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={on ? { pathLength: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.9,
                ease: EASE,
                delay: reduced ? 0 : ringDelay,
              }}
            />

            {/* crosshair marker at the centre */}
            <line
              x1={openingCx - 5}
              y1={openingCy}
              x2={openingCx + 5}
              y2={openingCy}
              stroke="var(--color-accent-bright)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <line
              x1={openingCx}
              y1={openingCy - 5}
              x2={openingCx}
              y2={openingCy + 5}
              stroke="var(--color-accent-bright)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </motion.g>
        </svg>

        {/* "Your opening" label — HTML overlay so we can use the icon + mono type.
            Positioned relative to the plot via percentage of the plot box. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: `${(openingCx / W) * 100}%`,
            top: `${(openingCy / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 18px))",
          }}
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={on ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            ease: EASE,
            delay: reduced ? 0 : ringDelay + 0.25,
          }}
        >
          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-accent-bright">
            <Sparkles className="h-2.5 w-2.5" aria-hidden />
            <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.12em]">
              Your opening
            </span>
          </span>
        </motion.div>
      </div>

      {/* legend / caption */}
      <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-4">
        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-faint">
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full border border-line-strong bg-surface-2"
          />
          Competitors · sized by SOV
        </span>
        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-accent-bright">
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full border border-dashed border-accent"
          />
          Whitespace
        </span>
      </div>
    </div>
  );
}
