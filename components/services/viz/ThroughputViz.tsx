"use client";

import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// --- sample data (fixed) ---
const BEFORE = 6;
const AFTER = 40;
const MAX = AFTER; // scale reference for bar heights

type Bar = {
  key: "before" | "after";
  label: string;
  value: number;
  accent: boolean;
};

const BARS: Bar[] = [
  { key: "before", label: "Before", value: BEFORE, accent: false },
  { key: "after", label: "After", value: AFTER, accent: true },
];

// --- geometry of the plotting area (viewBox units) ---
const W = 320;
const H = 200;
const PAD_X = 40;
const PAD_TOP = 22;
const PAD_BOTTOM = 30;
const PLOT_H = H - PAD_TOP - PAD_BOTTOM;
const BASELINE = PAD_TOP + PLOT_H;
const BAR_W = 74;
const SLOT_W = (W - PAD_X * 2) / BARS.length;

function barHeight(value: number) {
  return (value / MAX) * PLOT_H;
}

function barX(index: number) {
  return PAD_X + index * SLOT_W + (SLOT_W - BAR_W) / 2;
}

/** A single number that counts up from 0 → value when triggered. */
function CountingNumber({
  value,
  active,
  reduced,
  className,
}: {
  value: number;
  active: boolean;
  reduced: boolean;
  className?: string;
}) {
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    if (!active) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [active, value, reduced]);

  return <span className={className}>{Math.round(display)}</span>;
}

export function ThroughputViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reducedRaw = useReducedMotion();
  const reduced = reducedRaw ?? false;

  // gate: animate only once in view (or immediately when reduced)
  const active = reduced ? true : inView;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Throughput before versus after Agentic Marketing, at the same headcount: campaigns per month rise from 6 to 40, while brief-to-live time shrinks from 3 weeks to 3 days."
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line bg-surface/60 p-5 sm:p-6",
      )}
    >
      {/* ambient accent glow (decorative) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-accent/10 blur-3xl"
      />

      {/* header */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <span className="font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-[0.2em] text-faint">
          THROUGHPUT
          <span className="mx-1.5 text-line-strong">·</span>
          <span className="text-muted">same headcount</span>
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-[0.16em] text-faint">
          Campaigns / month
        </span>
      </div>

      {/* the bar chart */}
      <div className="relative z-10 mt-5">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="aspect-[320/200] h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient id="tpAfterBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent-bright)" />
              <stop offset="100%" stopColor="var(--color-accent-deep)" />
            </linearGradient>
            <linearGradient id="tpBeforeBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>
          </defs>

          {/* faint gridlines */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line
              key={f}
              x1={PAD_X - 10}
              x2={W - PAD_X + 10}
              y1={BASELINE - PLOT_H * f}
              y2={BASELINE - PLOT_H * f}
              stroke="rgba(255,255,255,0.045)"
              strokeWidth="1"
            />
          ))}

          {/* baseline */}
          <line
            x1={PAD_X - 10}
            x2={W - PAD_X + 10}
            y1={BASELINE}
            y2={BASELINE}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />

          {BARS.map((bar, i) => {
            const fullH = barHeight(bar.value);
            const x = barX(i);
            const cx = x + BAR_W / 2;
            return (
              <g key={bar.key}>
                {/* glow behind the winner bar */}
                {bar.accent && (
                  <motion.rect
                    x={x - 6}
                    width={BAR_W + 12}
                    rx={12}
                    fill="var(--color-accent)"
                    opacity={0.14}
                    initial={{ height: 0, y: BASELINE }}
                    animate={
                      active
                        ? { height: fullH + 10, y: BASELINE - fullH - 6 }
                        : { height: 0, y: BASELINE }
                    }
                    transition={{
                      duration: reduced ? 0 : 1.0,
                      ease: EASE,
                      delay: reduced ? 0 : 0.28,
                    }}
                    style={{ filter: "blur(6px)" }}
                  />
                )}

                {/* the bar */}
                <motion.rect
                  x={x}
                  width={BAR_W}
                  rx={9}
                  fill={bar.accent ? "url(#tpAfterBar)" : "url(#tpBeforeBar)"}
                  stroke={
                    bar.accent
                      ? "var(--color-accent-bright)"
                      : "rgba(255,255,255,0.1)"
                  }
                  strokeWidth={bar.accent ? 1 : 0.75}
                  initial={{ height: 0, y: BASELINE }}
                  animate={
                    active
                      ? { height: fullH, y: BASELINE - fullH }
                      : { height: 0, y: BASELINE }
                  }
                  transition={{
                    duration: reduced ? 0 : 1.0,
                    ease: EASE,
                    delay: reduced ? 0 : bar.accent ? 0.28 : 0.14,
                  }}
                />

                {/* x-axis label */}
                <text
                  x={cx}
                  y={BASELINE + 18}
                  textAnchor="middle"
                  className={bar.accent ? "fill-ink" : "fill-faint"}
                  style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {bar.label.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* animated counters (crisp DOM text, mirrors the bar values) */}
      <div className="relative z-10 -mt-1 flex items-end justify-around px-2">
        {BARS.map((bar) => (
          <div
            key={bar.key}
            className="flex flex-1 flex-col items-center gap-0.5"
          >
            <span className="sr-only">
              {bar.label}: {bar.value} campaigns per month
            </span>
            <CountingNumber
              value={bar.value}
              active={active}
              reduced={reduced}
              className={cn(
                "font-[family-name:var(--font-mono)] tabular-nums leading-none",
                bar.accent
                  ? "text-2xl font-semibold text-accent-bright"
                  : "text-lg font-medium text-muted",
              )}
            />
          </div>
        ))}
      </div>

      {/* divider */}
      <div className="relative z-10 mt-5 border-t border-line pt-4">
        {/* brief -> live time-shrink row */}
        <div className="flex items-center justify-between gap-3">
          <span className="font-[family-name:var(--font-mono)] text-[0.6rem] uppercase tracking-[0.18em] text-faint">
            brief &rarr; live
          </span>

          <motion.div
            className="flex items-center gap-2.5 sm:gap-3"
            initial={{ opacity: 0, y: 6 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{
              duration: reduced ? 0 : 0.6,
              ease: EASE,
              delay: reduced ? 0 : 1.0,
            }}
          >
            <span className="font-[family-name:var(--font-mono)] text-sm text-faint line-through decoration-faint/60">
              3 weeks
            </span>
            <ArrowRight
              className="h-3.5 w-3.5 shrink-0 text-muted"
              aria-hidden
            />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-sm font-semibold text-accent-bright">
              3 days
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
