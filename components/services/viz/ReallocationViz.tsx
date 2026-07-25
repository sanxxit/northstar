"use client";

import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Trend = "winner" | "loser" | "mid";

type Row = {
  label: string;
  /** starting share of the bar track, 0–100 */
  from: number;
  /** final share of the bar track, 0–100 */
  to: number;
  delta: string;
  trend: Trend;
};

const ROWS: readonly Row[] = [
  { label: "Hook 1", from: 62, to: 22, delta: "-$640", trend: "loser" },
  { label: "Hook 2", from: 44, to: 52, delta: "+$180", trend: "mid" },
  { label: "Hook 3", from: 40, to: 58, delta: "+$260", trend: "mid" },
  { label: "Hook 4", from: 48, to: 94, delta: "+$1,200", trend: "winner" },
];

const ROAS_FROM = 2.1;
const ROAS_TO = 3.4;

const MONO = "font-[family-name:var(--font-mono)]";

/** One reallocation row: label + animated track + delta. */
function AllocationRow({
  row,
  index,
  inView,
  reduced,
}: {
  row: Row;
  index: number;
  inView: boolean;
  reduced: boolean;
}) {
  const isWinner = row.trend === "winner";
  const isLoser = row.trend === "loser";

  const barTone = isWinner
    ? "bg-accent-bright"
    : isLoser
      ? "bg-[rgba(255,255,255,0.10)]"
      : "bg-elevated";

  const deltaTone = isWinner ? "text-accent-bright" : "text-faint";

  const delay = reduced ? 0 : 0.2 + index * 0.12;

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* label */}
      <span
        className={cn(
          "w-14 shrink-0 text-[0.7rem] tracking-wide sm:text-xs",
          MONO,
          isWinner ? "text-ink" : "text-muted",
        )}
      >
        {row.label}
      </span>

      {/* bar track */}
      <div
        className={cn(
          "relative h-7 flex-1 overflow-hidden rounded-lg border sm:h-8",
          isWinner ? "border-accent/40 bg-accent/5" : "border-line bg-surface-2/70",
        )}
      >
        {/* winner glow wash */}
        {isWinner && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-accent/10 blur-md"
          />
        )}
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-lg",
            barTone,
            isWinner && "shadow-[0_0_18px_-2px] shadow-accent/60",
          )}
          initial={reduced ? false : { width: `${row.from}%` }}
          animate={inView || reduced ? { width: `${row.to}%` } : {}}
          transition={{ duration: 0.95, ease: EASE, delay }}
          style={reduced ? { width: `${row.to}%` } : undefined}
        >
          {/* subtle top sheen on the fill */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1/2 rounded-t-lg bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent)]"
          />
        </motion.div>
      </div>

      {/* delta */}
      <motion.span
        className={cn(
          "w-16 shrink-0 text-right text-xs tabular-nums sm:w-[4.5rem] sm:text-sm",
          MONO,
          deltaTone,
        )}
        initial={reduced ? false : { opacity: 0, x: -4 }}
        animate={inView || reduced ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: delay + 0.45 }}
      >
        {row.delta}
      </motion.span>
    </div>
  );
}

export function ReallocationViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion() ?? false;

  const [roas, setRoas] = useState(reduced ? ROAS_TO : ROAS_FROM);

  useEffect(() => {
    if (reduced) {
      setRoas(ROAS_TO);
      return;
    }
    if (!inView) return;

    const controls = animate(ROAS_FROM, ROAS_TO, {
      duration: 1.4,
      ease: EASE,
      delay: 0.35,
      onUpdate: (v) => setRoas(v),
    });
    return () => controls.stop();
  }, [inView, reduced]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Live spend allocation reallocating budget from underperforming creatives to winners: Hook 4 grows to the largest share at plus $1,200 while Hook 1 shrinks with minus $640, lifting blended ROAS from 2.1x to 3.4x this week."
      className="card relative overflow-hidden rounded-2xl border border-line bg-surface/60 p-5 sm:p-6"
    >
      {/* ambient accent glow, top-right toward the winner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-accent/10 blur-3xl"
      />

      {/* header */}
      <div className="relative z-10 mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-accent-bright shadow-[0_0_10px_2px] shadow-accent/60 animate-pulse-glow"
          />
          <span className={cn("text-[0.65rem] tracking-[0.16em] text-faint", MONO)}>
            LIVE SPEND ALLOCATION
          </span>
        </div>

        {/* Blended ROAS readout */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-accent-bright" aria-hidden />
            <span
              className={cn(
                "text-lg leading-none tabular-nums text-accent-bright sm:text-xl",
                MONO,
              )}
            >
              {roas.toFixed(1)}x
            </span>
          </div>
          <span className="mt-1 text-[0.6rem] uppercase tracking-[0.14em] text-faint">
            Blended ROAS · this week
          </span>
        </div>
      </div>

      {/* rows */}
      <div className="relative z-10 space-y-3 sm:space-y-3.5">
        {ROWS.map((row, i) => (
          <AllocationRow
            key={row.label}
            row={row}
            index={i}
            inView={inView}
            reduced={reduced}
          />
        ))}
      </div>

      {/* footer caption */}
      <div className="relative z-10 mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-[0.65rem] text-faint">Auto-optimized allocation</span>
        <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-medium text-accent-bright">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-accent-bright animate-pulse-glow"
          />
          Reallocating in real time
        </span>
      </div>
    </div>
  );
}
