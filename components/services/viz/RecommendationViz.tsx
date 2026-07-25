"use client";

import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---- sample data: citation rate by assistant (wk 8), plus wk-1 baseline ----
type Row = {
  name: string;
  rate: number; // wk 8 citation rate %
  prev: number; // wk 1 citation rate %
};

// ordered by current citation rate (leader first)
const ROWS: readonly Row[] = [
  { name: "ChatGPT", rate: 35, prev: 12 },
  { name: "Perplexity", rate: 30, prev: 9 },
  { name: "Claude", rate: 22, prev: 8 },
  { name: "Gemini", rate: 15, prev: 6 },
] as const;

// a row counts as "cited" once its meter crosses this threshold
const CITED_THRESHOLD = 20;

// meter scale — small headroom above the leader so fills never touch the edge
const SCALE_MAX = 40;

// ---- a single meter row: name · animated fill · % · cited check ----
function MeterRow({
  row,
  index,
  inView,
  reduced,
  isLeader,
}: {
  row: Row;
  index: number;
  inView: boolean;
  reduced: boolean;
  isLeader: boolean;
}) {
  const [pct, setPct] = useState(reduced ? row.rate : 0);
  const [cited, setCited] = useState(reduced ? row.rate >= CITED_THRESHOLD : false);

  const delay = 0.15 + index * 0.14;
  const delta = row.rate - row.prev;
  const fillFraction = row.rate / SCALE_MAX; // 0..1 of the track

  useEffect(() => {
    if (reduced) {
      setPct(row.rate);
      setCited(row.rate >= CITED_THRESHOLD);
      return;
    }
    if (!inView) return;

    let alive = true;
    const controls = animate(0, row.rate, {
      duration: 1.05,
      delay,
      ease: EASE,
      onUpdate: (v) => {
        if (!alive) return;
        setPct(v);
        if (v >= CITED_THRESHOLD) setCited(true);
      },
    });
    return () => {
      alive = false;
      controls.stop();
    };
  }, [inView, reduced, row.rate, delay]);

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* assistant name */}
      <div className="flex w-[4.75rem] shrink-0 items-center gap-1.5 sm:w-24">
        <span
          className={cn(
            "font-display text-[0.8125rem] font-medium tracking-tight sm:text-sm",
            isLeader ? "text-ink" : "text-muted",
          )}
        >
          {row.name}
        </span>
      </div>

      {/* meter track + accent fill */}
      <div className="relative min-w-0 flex-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2 ring-1 ring-inset ring-line">
          <motion.div
            aria-hidden
            className={cn(
              "h-full rounded-full",
              isLeader
                ? "bg-gradient-to-r from-accent-deep via-accent to-accent-bright"
                : "bg-line-strong",
            )}
            initial={false}
            animate={{ width: `${(pct / SCALE_MAX) * 100}%` }}
            transition={{ duration: 0 }}
            style={
              isLeader
                ? { boxShadow: "0 0 12px -2px color-mix(in oklab, var(--color-accent) 70%, transparent)" }
                : undefined
            }
          />
        </div>

        {/* faint cited-threshold marker */}
        <span
          aria-hidden
          className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-line-strong"
          style={{ left: `${(CITED_THRESHOLD / SCALE_MAX) * 100}%` }}
        />
      </div>

      {/* percentage (mono) */}
      <div className="flex w-[2.75rem] shrink-0 items-baseline justify-end sm:w-12">
        <span
          className={cn(
            "font-[family-name:var(--font-mono)] text-sm tabular-nums sm:text-[0.9375rem]",
            isLeader ? "text-accent-bright" : "text-ink",
          )}
        >
          {pct.toFixed(0)}
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[0.625rem] text-faint">%</span>
      </div>

      {/* cited check + vs wk 1 delta */}
      <div className="flex w-[3.25rem] shrink-0 items-center justify-end gap-1.5 sm:w-[4.25rem]">
        <motion.span
          aria-hidden
          initial={false}
          animate={
            cited
              ? { opacity: 1, scale: 1 }
              : { opacity: 0.28, scale: 0.82 }
          }
          transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE }}
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full",
            cited
              ? "bg-surface-2 ring-1 ring-inset ring-line-strong"
              : "ring-1 ring-inset ring-line",
          )}
        >
          <Check
            className={cn("h-2.5 w-2.5", cited ? "text-muted" : "text-faint")}
            strokeWidth={3}
          />
        </motion.span>
        <span className="hidden font-[family-name:var(--font-mono)] text-[0.625rem] tabular-nums text-faint sm:inline">
          +{delta}
        </span>
      </div>
    </div>
  );
}

export function RecommendationViz() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  const leader = ROWS[0];
  const citedCount = ROWS.filter((r) => r.rate >= CITED_THRESHOLD).length;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Citation rate by AI assistant at week 8: ${ROWS.map(
        (r) => `${r.name} ${r.rate}%`,
      ).join(", ")}. ${leader.name} leads and ${citedCount} of ${ROWS.length} assistants now cite the brand above the ${CITED_THRESHOLD}% threshold, up from week 1.`}
      className="relative overflow-hidden rounded-2xl border border-line bg-surface/60 p-5 sm:p-6"
    >
      {/* ambient accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
      />

      {/* header */}
      <div className="relative mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow !tracking-[0.16em] flex items-center gap-2 text-faint">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-muted"
            />
            Who recommends you
          </p>
          <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
            Citation rate<span className="mx-1.5 text-faint">·</span>wk 8
          </p>
        </div>
        <span className="shrink-0 font-[family-name:var(--font-mono)] text-[0.625rem] uppercase tracking-[0.12em] text-faint">
          vs wk 1
        </span>
      </div>

      {/* meter rows */}
      <div className="relative space-y-3.5">
        {ROWS.map((row, i) => (
          <MeterRow
            key={row.name}
            row={row}
            index={i}
            inView={inView}
            reduced={reduced}
            isLeader={i === 0}
          />
        ))}
      </div>

      {/* footer strip */}
      <div className="relative mt-5 flex items-center justify-between border-t border-line pt-3.5">
        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[0.625rem] uppercase tracking-[0.12em] text-faint">
          <span
            aria-hidden
            className="h-3 w-px bg-line-strong"
          />
          cited threshold {CITED_THRESHOLD}%
        </span>
        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[0.625rem] uppercase tracking-[0.12em] text-muted">
          <Check className="h-3 w-3 text-muted" strokeWidth={3} aria-hidden />
          {citedCount}/{ROWS.length} citing you
        </span>
      </div>
    </div>
  );
}
