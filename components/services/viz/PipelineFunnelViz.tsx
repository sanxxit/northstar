"use client";

import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---- sample data (exact) ----
type Stage = {
  label: string;
  value: number;
  width: number; // funnel width fraction 0..1
  accent?: boolean;
};

const STAGES: Stage[] = [
  { label: "Leads", value: 4200, width: 1.0 },
  { label: "MQL", value: 1180, width: 0.72 },
  { label: "SQL", value: 410, width: 0.46 },
  { label: "Won", value: 96, width: 0.26, accent: true },
];

// conversion % shown between consecutive stages
const CONVERSIONS = ["28%", "35%", "23%"] as const;

// ---- animated integer that counts up 0 -> value ----
function CountValue({
  value,
  run,
  reduced,
  delay,
  className,
}: {
  value: number;
  run: boolean;
  reduced: boolean;
  delay: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    if (!run) return;
    const controls = animate(0, value, {
      duration: 1.0,
      delay,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [run, reduced, value, delay]);

  return (
    <span className={className}>
      {Math.round(display).toLocaleString("en-US")}
    </span>
  );
}

export function PipelineFunnelViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion() ?? false;
  const run = inView || reduced;

  const overall = ((STAGES[STAGES.length - 1].value / STAGES[0].value) * 100).toFixed(1);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Pipeline funnel: 4,200 leads convert to 1,180 MQLs (28%), then 410 SQLs (35%), then 96 won deals (23%) — a ${overall}% end-to-end conversion from lead to pipeline.`}
      className="card relative overflow-hidden rounded-2xl border border-line bg-surface/60 p-5 sm:p-6"
    >
      {/* ambient accent glow — decorative, sits behind the winning bar */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-14 left-1/2 h-40 w-56 -translate-x-1/2 rounded-full bg-accent/[0.07] blur-3xl"
      />
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 opacity-50"
      />

      {/* header */}
      <div className="relative z-10 mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[0.7rem] tracking-[0.14em] text-faint">
          <span aria-hidden>LEADS</span>
          <ArrowRight className="h-3 w-3 text-muted" aria-hidden />
          <span aria-hidden className="text-muted">PIPELINE</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-[family-name:var(--font-mono)] text-sm font-semibold text-ink tabular-nums">
            {overall}%
          </span>
          <span className="text-[0.7rem] text-faint">end-to-end</span>
        </div>
      </div>

      {/* funnel */}
      <div className="relative z-10 flex flex-col items-center">
        {STAGES.map((stage, i) => {
          const rowDelay = i * 0.14;
          const isLast = i === STAGES.length - 1;
          return (
            <div key={stage.label} className="w-full">
              {/* the bar */}
              <div className="flex justify-center">
                <motion.div
                  className={cn(
                    "relative flex h-14 items-center justify-between overflow-hidden rounded-lg px-4 sm:h-16 sm:px-5",
                    stage.accent
                      ? "border border-accent/40 bg-accent-deep/20"
                      : "border border-line bg-surface-2/70",
                  )}
                  style={{ width: `${stage.width * 100}%`, minWidth: 132 }}
                  initial={
                    reduced
                      ? false
                      : { clipPath: "inset(0 100% 0 0)", opacity: 0 }
                  }
                  animate={
                    run
                      ? { clipPath: "inset(0 0% 0 0)", opacity: 1 }
                      : undefined
                  }
                  transition={{ duration: 0.85, delay: rowDelay, ease: EASE }}
                >
                  {/* accent sheen inside the winning bar */}
                  {stage.accent && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/25 via-accent/10 to-transparent"
                    />
                  )}
                  {/* left hairline tick */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-0 h-full w-[3px]",
                      stage.accent ? "bg-accent-bright" : "bg-line-strong",
                    )}
                  />

                  <span
                    className={cn(
                      "relative z-10 font-[family-name:var(--font-mono)] text-[0.7rem] tracking-[0.12em] sm:text-xs",
                      stage.accent ? "text-accent-bright" : "text-muted",
                    )}
                  >
                    {stage.label.toUpperCase()}
                  </span>
                  <CountValue
                    value={stage.value}
                    run={run}
                    reduced={reduced}
                    delay={rowDelay}
                    className={cn(
                      "relative z-10 font-[family-name:var(--font-mono)] text-lg font-semibold tabular-nums sm:text-xl",
                      stage.accent ? "text-ink" : "text-ink",
                    )}
                  />
                </motion.div>
              </div>

              {/* connector + conversion % between stages */}
              {!isLast && (
                <motion.div
                  className="flex flex-col items-center py-1.5"
                  aria-hidden
                  initial={reduced ? false : { opacity: 0 }}
                  animate={run ? { opacity: 1 } : undefined}
                  transition={{
                    duration: 0.4,
                    delay: rowDelay + 0.45,
                    ease: EASE,
                  }}
                >
                  <span className="h-3 w-px bg-line-strong" />
                  <span
                    className={cn(
                      "font-[family-name:var(--font-mono)] text-[0.7rem] tabular-nums leading-none",
                      // highlight the strongest conversion step subtly via muted only; accent reserved for Won
                      "text-faint",
                    )}
                  >
                    {CONVERSIONS[i]}
                    <span className="ml-1 text-faint/70">↓</span>
                  </span>
                  <span className="mt-1 h-3 w-px bg-line-strong" />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* footer caption */}
      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-line pt-4">
        <span className="font-[family-name:var(--font-mono)] text-[0.7rem] tracking-[0.1em] text-faint">
          4 STAGES
        </span>
        <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-muted">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-line-strong"
          />
          Qualified pipeline, not raw leads
        </span>
      </div>
    </div>
  );
}
