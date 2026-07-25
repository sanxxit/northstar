"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---- sample data (fixed) --------------------------------------------------
const HOOKS = ["Bold claim", "Founder story", "Problem/agitate", "Social proof"] as const;
const AUDIENCES = ["Gym", "New moms", "Students", "Pros", "Value"] as const;

// winning hook x audience combos, as [rowIndex, colIndex]
const WINNERS: ReadonlyArray<readonly [number, number]> = [
  [0, 0], // Bold claim x Gym
  [1, 1], // Founder story x New moms
  [3, 3], // Social proof x Pros
  [2, 4], // Problem/agitate x Value
  [0, 3], // Bold claim x Pros
] as const;

const isWinner = (r: number, c: number) =>
  WINNERS.some(([wr, wc]) => wr === r && wc === c);

// ---------------------------------------------------------------------------
export function CreativeMatrixViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const lit = reduced ? true : inView;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Creative matrix of 4 hooks by 5 audiences: 5 winning hook-and-audience combinations light up while the rest stay flat. 480 variants narrow to 60 live, then 6 scaled."
      className="card relative overflow-hidden rounded-2xl border border-line bg-surface/60 p-5 sm:p-6"
    >
      {/* ambient decor */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 opacity-50"
      />

      {/* eyebrow */}
      <div className="relative z-10 mb-5 flex items-center justify-between gap-3">
        <span className="eyebrow !tracking-[0.16em] text-faint">
          Creative matrix
        </span>
        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] text-muted">
          <Sparkles className="h-3 w-3" aria-hidden />
          winners
        </span>
      </div>

      {/* grid: corner + column headers, then row header + cells per row */}
      <div className="relative z-10">
        {/* column header row */}
        <div
          aria-hidden
          className="mb-2 grid gap-1.5"
          style={{ gridTemplateColumns: "minmax(6.25rem,1.1fr) repeat(5,1fr)" }}
        >
          <div />
          {AUDIENCES.map((aud) => (
            <div
              key={aud}
              className="truncate text-center font-[family-name:var(--font-mono)] text-[10px] leading-tight text-faint sm:text-[11px]"
            >
              {aud}
            </div>
          ))}
        </div>

        {/* body rows */}
        <div className="flex flex-col gap-1.5">
          {HOOKS.map((hook, r) => (
            <div
              key={hook}
              className="grid items-center gap-1.5"
              style={{ gridTemplateColumns: "minmax(6.25rem,1.1fr) repeat(5,1fr)" }}
            >
              {/* row header */}
              <div
                aria-hidden
                className="truncate pr-1 font-[family-name:var(--font-mono)] text-[10px] text-muted sm:text-[11px]"
              >
                {hook}
              </div>

              {/* cells */}
              {AUDIENCES.map((_, c) => {
                const win = isWinner(r, c);
                const idx = r * AUDIENCES.length + c;
                return (
                  <motion.div
                    key={c}
                    aria-hidden
                    className="aspect-square w-full"
                    initial={
                      reduced
                        ? false
                        : { opacity: 0, scale: 0.55 }
                    }
                    animate={
                      lit
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.55 }
                    }
                    transition={{
                      duration: 0.42,
                      ease: EASE,
                      delay: reduced ? 0 : 0.15 + idx * 0.028,
                    }}
                  >
                    <div
                      className={cn(
                        "relative flex h-full w-full items-center justify-center rounded-[6px] border transition-colors",
                        win
                          ? "border-accent/60 bg-accent/20 shadow-[0_0_16px_-2px] shadow-accent/50"
                          : "border-line bg-surface-2",
                      )}
                    >
                      {win && (
                        <>
                          {/* inner accent core */}
                          <motion.span
                            className="h-1.5 w-1.5 rounded-full bg-accent-bright"
                            initial={reduced ? false : { opacity: 0, scale: 0 }}
                            animate={
                              lit
                                ? { opacity: 1, scale: 1 }
                                : { opacity: 0, scale: 0 }
                            }
                            transition={{
                              duration: 0.5,
                              ease: EASE,
                              delay: reduced ? 0 : 0.55 + idx * 0.028,
                            }}
                          />
                          {/* soft ring pulse */}
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-[6px] ring-1 ring-inset ring-accent/40"
                          />
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* funnel caption */}
      <motion.div
        className="relative z-10 mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-4 font-[family-name:var(--font-mono)] text-[11px] sm:text-xs"
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={lit ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.9 }}
      >
        <span className="text-muted">480 variants</span>
        <span className="text-faint" aria-hidden>{"->"}</span>
        <span className="text-muted">60 live</span>
        <span className="text-faint" aria-hidden>{"->"}</span>
        <span className="font-medium text-ink">6 scaled</span>
      </motion.div>
    </div>
  );
}
