"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { capabilities, type Capability } from "@/lib/content";
import { iconMap } from "@/components/icon-map";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ------------------------------------------------------------------ */
/* Featured tile — a live-looking mini performance dashboard.          */
/* ------------------------------------------------------------------ */

type Channel = {
  name: string;
  roas: string;
  width: number; // target utilization %
  hot?: boolean; // the single accent-highlighted row
};

const CHANNELS: Channel[] = [
  { name: "Meta", roas: "3.4× ROAS", width: 88, hot: true },
  { name: "Google", roas: "2.9× ROAS", width: 72 },
  { name: "TikTok", roas: "2.1× ROAS", width: 54 },
  { name: "LinkedIn", roas: "1.8× ROAS", width: 41 },
];

function PerformancePanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [reduced, setReduced] = useState(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setPlay(true);
      return;
    }
    const t = setTimeout(() => setPlay(true), 120);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="relative mt-6 overflow-hidden rounded-xl border border-line bg-bg/60 p-4 sm:p-5"
    >
      {/* panel header */}
      <div className="flex items-center justify-between gap-3">
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-faint">
          Live spend allocation
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent-bright">
          <motion.span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-accent-bright shadow-[0_0_10px_2px_color-mix(in_oklab,var(--color-accent)_70%,transparent)]"
            animate={reduced ? { opacity: 1 } : { opacity: [0.35, 1, 0.35] }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1.8, ease: "easeInOut", repeat: Infinity }
            }
          />
          Optimizing 24/7
        </span>
      </div>

      {/* channel rows */}
      <div className="mt-5 space-y-3.5">
        {CHANNELS.map((c, i) => (
          <div key={c.name}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-ink/90">{c.name}</span>
              <span
                className={cn(
                  "font-[family-name:var(--font-mono)] text-xs tabular-nums",
                  c.hot ? "text-accent-bright" : "text-muted",
                )}
              >
                {c.roas}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <motion.div
                aria-hidden
                className={cn(
                  "h-full rounded-full",
                  c.hot ? "bg-accent-bright" : "bg-line-strong",
                )}
                initial={{ width: "0%" }}
                animate={{ width: play ? `${c.width}%` : "0%" }}
                transition={{
                  duration: reduced ? 0 : 0.9,
                  ease: EASE,
                  delay: reduced ? 0 : 0.12 * i,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* headline metric row */}
      <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-4">
        <div>
          <div className="font-display text-2xl leading-none tracking-tight text-ink sm:text-3xl">
            3.4<span className="text-accent-bright">×</span>
          </div>
          <div className="mt-1.5 text-xs text-faint">Blended ROAS this week</div>
        </div>
        <div className="text-right">
          <div className="font-[family-name:var(--font-mono)] text-sm tabular-nums text-ink/90">
            +18.6%
          </div>
          <div className="mt-1.5 text-xs text-faint">vs. last week</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared duotone icon badge.                                          */
/* ------------------------------------------------------------------ */

function IconBadge({ icon }: { icon: string }) {
  const Icon = iconMap[icon] ?? iconMap.Sparkles;
  return (
    <span className="inline-grid h-11 w-11 place-items-center rounded-lg bg-accent/10 text-accent-bright ring-1 ring-inset ring-accent/20">
      <Icon className="h-5 w-5" aria-hidden />
    </span>
  );
}

function HoverArrow() {
  return (
    <ArrowUpRight
      className="h-5 w-5 shrink-0 text-faint transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-bright"
      aria-hidden
    />
  );
}

/* ------------------------------------------------------------------ */
/* Featured (large) tile.                                              */
/* ------------------------------------------------------------------ */

function FeaturedTile({ item }: { item: Capability }) {
  return (
    <Link
      href={item.href}
      aria-label={`${item.label} — view service`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-surface p-6 transition-[transform,border-color] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-line-strong sm:p-7"
    >
      {/* quiet structured background — a faint hairline grid, no floating orb */}
      <div
        aria-hidden
        className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-[0.35]"
      />

      <div className="relative flex items-start justify-between gap-4">
        <IconBadge icon={item.icon} />
        <HoverArrow />
      </div>

      <div className="relative mt-5">
        <h3 className="font-display text-xl tracking-tight text-ink sm:text-2xl">
          {item.label}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          {item.note}
        </p>
      </div>

      <div className="relative mt-auto">
        <PerformancePanel />
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Standard tile.                                                      */
/* ------------------------------------------------------------------ */

function Tile({ item }: { item: Capability }) {
  return (
    <Link
      href={item.href}
      aria-label={`${item.label} — view service`}
      className="group relative flex h-full flex-col rounded-[1.25rem] border border-line bg-surface p-6 transition-[transform,border-color] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-line-strong"
    >
      <div className="flex items-start justify-between gap-4">
        <IconBadge icon={item.icon} />
        <HoverArrow />
      </div>

      <h3 className="mt-5 font-display text-lg tracking-tight text-ink">
        {item.label}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{item.note}</p>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Section.                                                            */
/* ------------------------------------------------------------------ */

// Non-featured tiles that take a 2-col span on the lg grid so the bento
// reads as intentionally asymmetric (never a plain 3×3). Keyed by label.
const WIDE_SPANS = new Set(["Agentic marketing"]);

export function Capabilities() {
  const items = capabilities.items;
  const featured = items.find((i) => i.featured);
  const rest = items.filter((i) => !i.featured);

  return (
    <section id="capabilities" className="relative py-16 md:py-32 lg:py-40">
      {/* quiet textured background — faint masked dots only. No section glow. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-dots mask-fade absolute inset-0 opacity-40" />
      </div>

      <div className="shell relative">
        {/* ---------- header ---------- */}
        <div className="mb-12 md:mb-16">
          <Reveal>
            <p className="eyebrow">{capabilities.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-3xl font-display tracking-tight text-[clamp(2.25rem,7vw,3.75rem)] leading-[1.05]">
              One partner.{" "}
              <span className="font-[family-name:var(--font-serif)] italic text-muted">
                The entire growth stack.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-2xl text-muted">{capabilities.sub}</p>
          </Reveal>
        </div>

        {/* ---------- bento ---------- */}
        <Stagger className="grid auto-rows-[minmax(0,1fr)] grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured && (
            <StaggerItem className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
              <FeaturedTile item={featured} />
            </StaggerItem>
          )}

          {rest.map((item) => (
            <StaggerItem
              key={item.label}
              className={cn(WIDE_SPANS.has(item.label) && "lg:col-span-2")}
            >
              <Tile item={item} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
