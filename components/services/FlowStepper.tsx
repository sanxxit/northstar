"use client";

import { motion } from "motion/react";
import { ArrowRight, RotateCcw } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const pad = (i: number) => String(i + 1).padStart(2, "0");

/** On-brand flow diagram: horizontal glowing stepper on desktop, vertical on mobile. */
export function FlowStepper({
  steps,
  loop = false,
}: {
  steps: readonly string[];
  loop?: boolean;
}) {
  return (
    <div>
      {/* ---------- desktop: horizontal ---------- */}
      <div className="hidden md:block">
        <ol className="relative flex items-start justify-between gap-2">
          <div
            aria-hidden
            className="absolute inset-x-6 top-7 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
          />
          {steps.map((s, i) => (
            <motion.li
              key={s}
              className="relative z-10 flex flex-1 flex-col items-center text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-accent/30 bg-surface font-[family-name:var(--font-mono)] text-sm text-accent-bright shadow-[0_0_24px_-8px_color-mix(in_oklab,var(--color-accent)_60%,transparent)]">
                {pad(i)}
              </div>
              <span className="mt-3 max-w-[13ch] font-display text-sm leading-snug text-ink">
                {s}
              </span>
            </motion.li>
          ))}
        </ol>
        {loop && (
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-faint">
            <RotateCcw className="h-4 w-4 text-accent-bright" aria-hidden />
            <span>It loops — every cycle feeds the next.</span>
          </div>
        )}
      </div>

      {/* ---------- mobile: vertical ---------- */}
      <div className="md:hidden">
        <ol className="relative">
          <span
            aria-hidden
            className="absolute bottom-6 left-[1.375rem] top-3 w-px bg-gradient-to-b from-accent via-line to-transparent"
          />
          {steps.map((s, i) => (
            <motion.li
              key={s}
              className="relative flex items-center gap-4 pb-6 last:pb-0"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
            >
              <div className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent/30 bg-surface font-[family-name:var(--font-mono)] text-xs text-accent-bright">
                {pad(i)}
              </div>
              <span className="font-display text-base text-ink">{s}</span>
            </motion.li>
          ))}
        </ol>
        {loop && (
          <div className="mt-3 flex items-center gap-2 pl-1 text-sm text-faint">
            <RotateCcw className="h-4 w-4 text-accent-bright" aria-hidden />
            <span>…and back to the start. The loop compounds.</span>
          </div>
        )}
      </div>
    </div>
  );
}
