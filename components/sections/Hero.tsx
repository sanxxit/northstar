"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { hero } from "@/lib/content";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Loader2, ShieldCheck } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// The growth funnel — muted, sits behind the hero as ambient texture.
const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
});

/* ------------------------------------------------------------------ */
/* reduced-motion — reactive, SSR-safe.                                */
/* ------------------------------------------------------------------ */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/* TYPEWRITER — reveals the brief character-by-character (~1.6s).       */
/* Reduced motion => full text, solid caret.                           */
/* ------------------------------------------------------------------ */

function Typewriter({ text, reduced }: { text: string; reduced: boolean }) {
  const [count, setCount] = useState(reduced ? text.length : 0);

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const total = 1600; // ~1.6s
    const step = Math.max(12, total / text.length);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(id);
    }, step);
    return () => clearInterval(id);
  }, [text, reduced]);

  const done = count >= text.length;

  return (
    <p className="mt-4 text-sm leading-relaxed text-ink/90">
      <span>{text.slice(0, count)}</span>
      <motion.span
        aria-hidden
        className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 rounded-full bg-accent-bright align-middle"
        animate={reduced || !done ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
        transition={
          reduced || !done
            ? { duration: 0 }
            : { duration: 1, ease: "linear", repeat: Infinity }
        }
      />
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* CHIPS — light up in sequence: muted -> accent-tinted + Check.       */
/* ------------------------------------------------------------------ */

function AgentChips({
  chips,
  reduced,
}: {
  chips: readonly string[];
  reduced: boolean;
}) {
  const [lit, setLit] = useState<number>(reduced ? chips.length : 0);

  useEffect(() => {
    if (reduced) {
      setLit(chips.length);
      return;
    }
    setLit(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    chips.forEach((_, i) => {
      timers.push(
        setTimeout(() => setLit((n) => Math.max(n, i + 1)), 1400 + i * 320),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [chips, reduced]);

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {chips.map((chip, i) => {
        const on = i < lit;
        return (
          <span
            key={chip}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors duration-500",
              on
                ? "border-accent/40 bg-accent/10 text-accent-bright"
                : "border-line bg-surface-2 text-muted",
            )}
          >
            <span
              className={cn(
                "grid h-3.5 w-3.5 place-items-center rounded-full transition-colors duration-500",
                on ? "bg-accent/20" : "bg-transparent",
              )}
            >
              {on ? (
                <Check className="h-2.5 w-2.5 text-accent-bright" aria-hidden />
              ) : (
                <span aria-hidden className="h-1 w-1 rounded-full bg-faint" />
              )}
            </span>
            {chip}
          </span>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DEPLOY ROWS — Ready -> Deploying (spin) -> Deployed (check).         */
/* Sequenced with setTimeout, cleaned up on unmount.                   */
/* Reduced motion => all "Deployed".                                   */
/* ------------------------------------------------------------------ */

type RowStatus = "ready" | "deploying" | "deployed";

function DeployStatus({ status }: { status: RowStatus }) {
  if (status === "deployed") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">
        <Check className="h-3.5 w-3.5" aria-hidden />
        Deployed
      </span>
    );
  }
  if (status === "deploying") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-bright">
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        Deploying
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-faint">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-faint" />
      Ready
    </span>
  );
}

function DeployRows({
  rows,
  reduced,
}: {
  rows: readonly { asset: string; tool: string }[];
  reduced: boolean;
}) {
  const [statuses, setStatuses] = useState<RowStatus[]>(() =>
    rows.map(() => (reduced ? "deployed" : "ready")),
  );
  const [allDone, setAllDone] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setStatuses(rows.map(() => "deployed"));
      setAllDone(true);
      return;
    }
    setStatuses(rows.map(() => "ready"));
    setAllDone(false);

    const timers: ReturnType<typeof setTimeout>[] = [];
    const base = 2600; // start after brief + chips have played
    rows.forEach((_, i) => {
      const start = base + i * 900;
      timers.push(
        setTimeout(
          () =>
            setStatuses((prev) => {
              const next = [...prev];
              next[i] = "deploying";
              return next;
            }),
          start,
        ),
      );
      timers.push(
        setTimeout(
          () =>
            setStatuses((prev) => {
              const next = [...prev];
              next[i] = "deployed";
              return next;
            }),
          start + 620,
        ),
      );
    });
    timers.push(
      setTimeout(() => setAllDone(true), base + (rows.length - 1) * 900 + 700),
    );

    return () => timers.forEach(clearTimeout);
  }, [rows, reduced]);

  return (
    <div className="space-y-3">
      <div className="divide-y divide-line rounded-xl border border-line bg-bg/50">
        {rows.map((row, i) => (
          <div
            key={`${row.asset}-${row.tool}`}
            className="flex items-center justify-between gap-3 px-3.5 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="truncate text-ink">{row.asset}</span>
              <ArrowRight
                className="h-3.5 w-3.5 shrink-0 text-faint"
                aria-hidden
              />
              <span className="truncate text-muted">{row.tool}</span>
            </div>
            <DeployStatus status={statuses[i]} />
          </div>
        ))}
      </div>

      {/* footer — campaign live */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-colors duration-500",
          allDone
            ? "border-accent/30 bg-accent/10 text-ink"
            : "border-line bg-surface-2 text-muted",
        )}
      >
        <span
          className={cn(
            "grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors duration-500",
            allDone ? "bg-accent text-white" : "bg-surface text-faint",
          )}
        >
          <Check className="h-3 w-3" aria-hidden />
        </span>
        <span className="font-medium">{hero.panel.done}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* THE PANEL — the ONE contained hero glow moment.                     */
/* Optional pointer-tilt on hover+fine only, off under reduced motion. */
/* ------------------------------------------------------------------ */

function AgentPanel({ reduced }: { reduced: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tiltEnabled, setTiltEnabled] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 18, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 140, damping: 18, mass: 0.4 });

  useEffect(() => {
    if (reduced) {
      setTiltEnabled(false);
      return;
    }
    setTiltEnabled(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, [reduced]);

  const handleMove = (e: React.MouseEvent) => {
    if (!tiltEnabled) return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    ry.set(px * 4); // subtle
    rx.set(py * -4);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, ease: EASE, delay: 0.28 }}
      className="relative w-full"
      style={{ perspective: 1200 }}
    >
      {/* the ONE contained accent glow — behind the panel only */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -inset-y-8 rounded-[2.25rem] bg-[radial-gradient(60%_55%_at_60%_40%,color-mix(in_oklab,var(--color-accent)_26%,transparent)_0%,transparent_72%)] blur-2xl"
      />

      <motion.div
        ref={wrapRef}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="card glow-accent relative overflow-hidden rounded-2xl border-line p-5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:p-6"
      >
        {/* faint inner texture */}
        <div
          aria-hidden
          className="bg-dots mask-fade pointer-events-none absolute inset-0 opacity-30"
        />

        <div className="relative">
          {/* (a) header — window chrome + agent + live status */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
                <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
                <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              </div>
              <span className="font-mono text-xs tracking-tight text-muted">
                {hero.panel.agent}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent-bright">
              <motion.span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-accent-bright shadow-[0_0_10px_2px_color-mix(in_oklab,var(--color-accent)_70%,transparent)]"
                animate={
                  reduced
                    ? { opacity: 1, scale: 1 }
                    : { opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 1.6, ease: "easeInOut", repeat: Infinity }
                }
              />
              {hero.panel.status}
            </span>
          </div>

          {/* (b) brief — typewriter */}
          <div className="mt-5 rounded-xl border border-line bg-surface/60 p-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              Brief
            </span>
            <Typewriter text={hero.panel.brief} reduced={reduced} />

            {/* (c) chips light up in sequence */}
            <AgentChips chips={hero.panel.chips} reduced={reduced} />
          </div>

          {/* (d) deploy rows + (e) footer */}
          <div className="mt-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              Deploy
            </span>
            <div className="mt-3">
              <DeployRows rows={hero.panel.deploy} reduced={reduced} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* PROOF TICKER — pinned to bottom, infinite marquee, aria-hidden.     */
/* ------------------------------------------------------------------ */

function ProofTicker() {
  const items = [...hero.ticker, ...hero.ticker];
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 z-10 border-t border-line bg-bg/70 backdrop-blur-sm"
    >
      <div className="overflow-hidden py-3">
        <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap pr-8">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center gap-8 font-mono text-xs tracking-tight text-muted"
            >
              <span
                aria-hidden
                className="h-1 w-1 rounded-full bg-accent-bright/70"
              />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HERO.                                                               */
/* ------------------------------------------------------------------ */

export function Hero() {
  const reduced = useReducedMotion();

  const copyStagger = (i: number) =>
    ({
      initial: { opacity: 0, y: 22 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.7, ease: EASE, delay: 0.08 + i * 0.09 },
    }) as const;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pb-24 pt-28 md:pb-28 md:pt-32 lg:pt-40"
    >
      {/* ---------- background: dull funnel pushed behind a scrim ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* the 3D growth funnel — muted, low-opacity, edge-masked */}
        <div className="absolute inset-0 opacity-[0.68] [mask-image:radial-gradient(ellipse_82%_82%_at_50%_44%,#000_34%,transparent_84%)]">
          <HeroCanvas />
        </div>
        {/* scrim so the copy + agent panel stay crisp */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_56%_60%_at_50%_44%,transparent_16%,rgba(8,9,12,0.55))]" />
        {/* top seam into bg */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg to-transparent" />
        {/* bottom seam into bg */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="shell relative z-10 w-full">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ---------- LEFT: copy ---------- */}
          <div className="max-w-xl">
            {/* eyebrow */}
            <motion.div {...copyStagger(0)}>
              <span className="eyebrow inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-accent-bright"
                />
                {hero.eyebrow}
              </span>
            </motion.div>

            {/* the ONLY h1 on the page */}
            <motion.h1
              {...copyStagger(1)}
              className="mt-5 font-display text-[clamp(2.75rem,9vw,4.5rem)] leading-[0.98] tracking-tight"
            >
              <span className="block text-ink">{hero.h1Lines[0]}</span>
              <span className="block font-[family-name:var(--font-serif)] font-normal italic text-ink">
                {hero.h1Lines[1]}
              </span>
            </motion.h1>

            {/* subhead — agency outcomes */}
            <motion.p
              {...copyStagger(2)}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
            >
              {hero.subhead}
            </motion.p>

            {/* icp */}
            <motion.p {...copyStagger(3)} className="mt-4 text-sm text-faint">
              {hero.icp}
            </motion.p>

            {/* CTA row */}
            <motion.div {...copyStagger(4)} className="mt-8 flex flex-wrap gap-4">
              <MagneticButton
                href={hero.ctaPrimary.href}
                ariaLabel={`${hero.ctaPrimary.label} (opens booking form in a new tab)`}
              >
                {hero.ctaPrimary.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </MagneticButton>
              <MagneticButton variant="outline" href={hero.ctaSecondary.href}>
                {hero.ctaSecondary.label}
              </MagneticButton>
            </motion.div>

            {/* compliance microline */}
            <motion.p
              {...copyStagger(5)}
              className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-faint"
            >
              <ShieldCheck
                className="h-3.5 w-3.5 text-accent-bright/80"
                aria-hidden
              />
              {hero.compliance}
            </motion.p>
          </div>

          {/* ---------- RIGHT: the live agent panel ---------- */}
          <div className="w-full">
            <AgentPanel reduced={reduced} />
          </div>
        </div>
      </div>

      {/* ---------- bottom proof ticker ---------- */}
      <ProofTicker />
    </section>
  );
}
