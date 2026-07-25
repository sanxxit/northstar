"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { compounding } from "@/lib/content";
import { Check } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---- highlight the word "memory" in the title without rewriting copy ----
function TitleWithAccent({ title }: { title: string }) {
  const parts = title.split(/(memory)/i);
  return (
    <>
      {parts.map((part, i) =>
        /^memory$/i.test(part) ? (
          <span key={i} className="text-gradient">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

// ---- The growing memory graph: climbing area chart + accumulating nodes ----
function MemoryGraph({ growth }: { growth: readonly number[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  // geometry of the plotting area (viewBox units)
  const W = 320;
  const H = 240;
  const padX = 26;
  const padTop = 26;
  const padBottom = 34;
  const plotW = W - padX * 2;
  const plotH = H - padTop - padBottom;

  const max = Math.max(...growth);
  const points = growth.map((v, i) => {
    const x = padX + (growth.length === 1 ? 0 : (i / (growth.length - 1)) * plotW);
    const y = padTop + plotH - (v / max) * plotH;
    return { x, y, v, week: i + 1 };
  });

  // smooth-ish path via straight segments (clean, premium, readable)
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath =
    `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(
      padTop + plotH
    ).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`;

  const baselineY = padTop + plotH;

  return (
    <div
      ref={ref}
      className="card glow-accent relative flex min-h-[26rem] flex-col overflow-hidden rounded-2xl p-6 sm:p-8"
    >
      {/* faint dotted texture + soft accent glow */}
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-accent-deep/15 blur-3xl"
      />

      {/* header row */}
      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full bg-accent-bright shadow-[0_0_12px_2px] shadow-accent/60 animate-pulse-glow"
          />
          <span className="eyebrow !tracking-[0.14em] text-faint">
            Brand memory
          </span>
        </div>
        <div className="flex items-baseline gap-1 font-display">
          <span className="text-2xl font-semibold text-ink tabular-nums">
            {max}
          </span>
          <span className="text-xs text-faint">patterns</span>
        </div>
      </div>

      {/* the chart */}
      <div className="relative z-10 flex flex-1 items-center">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="aspect-[320/240] h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Accumulated brand-memory patterns growing from ${growth[0]} in week 1 to ${max} by week ${growth.length}.`}
        >
          <defs>
            <linearGradient id="compArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="compLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="var(--color-accent-bright)" />
            </linearGradient>
          </defs>

          {/* faint horizontal gridlines */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={padX}
              x2={W - padX}
              y1={padTop + plotH * f}
              y2={padTop + plotH * f}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          {/* baseline */}
          <line
            x1={padX}
            x2={W - padX}
            y1={baselineY}
            y2={baselineY}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {/* filled area, wiped in */}
          <motion.path
            d={areaPath}
            fill="url(#compArea)"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          />

          {/* climbing line, drawn on */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#compLine)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}
          />

          {/* accumulating nodes — appear progressively left → right */}
          {points.map((p, i) => (
            <motion.g
              key={p.week}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                ease: EASE,
                delay: 0.4 + i * 0.14,
              }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            >
              {/* soft halo grows with the value to convey density */}
              <circle
                cx={p.x}
                cy={p.y}
                r={4 + (p.v / max) * 7}
                fill="var(--color-accent)"
                opacity={0.16}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={i === points.length - 1 ? 5 : 3.6}
                fill={i === points.length - 1 ? "var(--color-accent-bright)" : "var(--color-bg)"}
                stroke="var(--color-accent-bright)"
                strokeWidth="2"
              />
            </motion.g>
          ))}

          {/* week labels */}
          {points.map((p, i) => (
            <motion.text
              key={`lbl-${p.week}`}
              x={p.x}
              y={H - 12}
              textAnchor="middle"
              className="fill-faint"
              style={{ fontSize: "9px", fontFamily: "var(--font-sans)" }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, ease: EASE, delay: 0.5 + i * 0.14 }}
            >
              W{p.week}
            </motion.text>
          ))}
        </svg>
      </div>

      {/* caption strip */}
      <div className="relative z-10 mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="text-xs text-faint">Week 1</span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-bright">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-accent-bright animate-pulse-glow"
          />
          Compounding every cycle
        </span>
        <span className="text-xs text-faint">Week {growth.length}</span>
      </div>
    </div>
  );
}

export function Compounding() {
  return (
    <section id="compounding" className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      <div className="shell relative">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* LEFT — copy */}
          <div className="order-1">
            <Reveal>
              <p className="eyebrow">{compounding.eyebrow}</p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="mt-5 font-display text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
                <TitleWithAccent title={compounding.title} />
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {compounding.body}
              </p>
            </Reveal>

            <Stagger className="mt-10 space-y-3">
              {compounding.points.map((point) => (
                <StaggerItem key={point}>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        "bg-accent/15 ring-1 ring-inset ring-accent/30",
                      )}
                    >
                      <Check className="h-4 w-4 text-accent-bright" aria-hidden />
                    </span>
                    <span className="text-ink">{point}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* RIGHT — visual */}
          <Reveal delay={0.1} className="order-2">
            <MemoryGraph growth={compounding.growth} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
