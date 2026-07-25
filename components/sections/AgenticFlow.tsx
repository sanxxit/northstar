"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { agentic, type AgenticStep } from "@/lib/content";
import { iconMap } from "@/components/icon-map";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Loader2, Zap } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reactive prefers-reduced-motion flag (safe for SSR + live changes). */
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
/* STEP 01 — the "Brief" card: a live-generating brief with a caret.   */
/* ------------------------------------------------------------------ */

function BriefMock({ brief }: { brief: NonNullable<AgenticStep["brief"]> }) {
  const reduced = useReducedMotion();
  return (
    <div className="relative">
      {/* soft accent glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_40%,color-mix(in_oklab,var(--color-accent)_22%,transparent)_0%,transparent_70%)] blur-2xl"
      />

      <div className="glass relative rounded-2xl p-5 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.9)]">
        {/* header row */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            {brief.label}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent-bright">
            <motion.span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-accent-bright shadow-[0_0_10px_2px_color-mix(in_oklab,var(--color-accent)_70%,transparent)]"
              animate={
                reduced
                  ? { opacity: 1, scale: 1 }
                  : { opacity: [0.35, 1, 0.35], scale: [0.9, 1.15, 0.9] }
              }
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 1.6, ease: "easeInOut", repeat: Infinity }
              }
            />
            {brief.state}
          </span>
        </div>

        {/* brief body with blinking caret */}
        <p className="mt-4 text-sm leading-relaxed text-ink/90">
          {brief.text}
          <motion.span
            aria-hidden
            className="ml-1 inline-block h-4 w-[2px] translate-y-0.5 rounded-full bg-accent-bright align-middle"
            animate={reduced ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1, ease: "linear", repeat: Infinity }
            }
          />
        </p>

        {/* chips */}
        <Stagger className="mt-5 flex flex-wrap gap-2">
          {brief.chips.map((chip) => (
            <StaggerItem key={chip}>
              <span className="inline-flex rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-muted">
                {chip}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STEP 02 — brand ticks + an animated deployment plan.                */
/* ------------------------------------------------------------------ */

type RowStatus = "ready" | "deploying" | "deployed";

function RowStatusBadge({ status }: { status: RowStatus }) {
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

function DeployMock({
  brandTicks,
  plan,
}: {
  brandTicks: NonNullable<AgenticStep["brandTicks"]>;
  plan: NonNullable<AgenticStep["plan"]>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "0px 0px -15% 0px" });
  const [statuses, setStatuses] = useState<RowStatus[]>(() =>
    plan.rows.map(() => "ready"),
  );

  useEffect(() => {
    if (!inView) return;

    // Reduced motion: jump straight to the final "deployed" state.
    if (prefersReducedMotion()) {
      setStatuses(plan.rows.map(() => "deployed"));
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    plan.rows.forEach((_, i) => {
      const start = 500 + 700 * i;
      timers.push(
        setTimeout(() => {
          setStatuses((prev) => {
            const next = [...prev];
            next[i] = "deploying";
            return next;
          });
        }, start),
      );
      timers.push(
        setTimeout(() => {
          setStatuses((prev) => {
            const next = [...prev];
            next[i] = "deployed";
            return next;
          });
        }, start + 700),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [inView, plan.rows]);

  return (
    <div className="relative space-y-4">
      {/* soft accent glow behind the highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_55%_55%,color-mix(in_oklab,var(--color-accent)_22%,transparent)_0%,transparent_70%)] blur-2xl"
      />

      {/* (a) brand-check ticks */}
      <div className="glass relative rounded-2xl p-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
          Brand check
        </span>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {brandTicks.map((tick) => (
            <span
              key={tick}
              className="inline-flex items-center gap-2 text-sm text-ink/90"
            >
              <span className="grid h-4 w-4 place-items-center rounded-full bg-accent/15">
                <Check className="h-3 w-3 text-accent" aria-hidden />
              </span>
              {tick}
            </span>
          ))}
        </div>
      </div>

      {/* (b) deployment plan — the visual highlight */}
      <div
        ref={cardRef}
        className="glass relative rounded-2xl p-5 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.9)]"
      >
        {/* header */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-ink">{plan.header}</span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--color-accent)_80%,transparent)]">
            <Zap className="h-3.5 w-3.5" aria-hidden />
            {plan.action}
          </span>
        </div>

        {/* rows */}
        <div className="mt-4 divide-y divide-line rounded-xl border border-line bg-surface/60">
          {plan.rows.map((row, i) => (
            <div
              key={`${row.asset}-${row.dest}`}
              className="flex items-center justify-between gap-3 px-3.5 py-3"
            >
              <div className="flex min-w-0 items-center gap-2 text-sm">
                <span className="truncate text-ink">{row.asset}</span>
                <ArrowRight
                  className="h-3.5 w-3.5 shrink-0 text-faint"
                  aria-hidden
                />
                <span className="truncate text-muted">{row.dest}</span>
              </div>
              <RowStatusBadge status={statuses[i]} />
            </div>
          ))}
        </div>

        {/* caption */}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-accent-bright shadow-[0_0_8px_1px_color-mix(in_oklab,var(--color-accent)_70%,transparent)]"
          />
          {plan.caption}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STEP 03 — the tools the agents operate, as styled text chips.       */
/* ------------------------------------------------------------------ */

const OPERATED_TOOLS = ["Responsys", "Marketo", "Salesforce Marketing Cloud"];

function ToolsMock() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_45%,color-mix(in_oklab,var(--color-accent)_18%,transparent)_0%,transparent_70%)] blur-2xl"
      />

      <div className="glass relative rounded-2xl p-6">
        <div className="bg-dots mask-fade pointer-events-none absolute inset-0 rounded-2xl opacity-40" />
        <div className="relative">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            Operated by agents
          </span>
          <Stagger className="mt-4 flex flex-wrap gap-2.5">
            {OPERATED_TOOLS.map((tool) => (
              <StaggerItem key={tool}>
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-muted">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-accent-bright/80"
                  />
                  {tool}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-4 text-xs leading-relaxed text-faint">
            No manual clicking. No bottlenecks. Your agents log in and ship.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Per-step mock router.                                               */
/* ------------------------------------------------------------------ */

function StepMock({ step }: { step: AgenticStep }) {
  if (step.brief) return <BriefMock brief={step.brief} />;
  if (step.brandTicks && step.plan)
    return <DeployMock brandTicks={step.brandTicks} plan={step.plan} />;
  return <ToolsMock />;
}

/* ------------------------------------------------------------------ */
/* Section.                                                            */
/* ------------------------------------------------------------------ */

export function AgenticFlow() {
  return (
    <section id="how" className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      {/* decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-24 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent)_14%,transparent)_0%,transparent_62%)] blur-2xl" />
      </div>

      <div className="shell relative">
        {/* ---------- header ---------- */}
        <div className="mb-16 text-center md:mb-20">
          <Reveal>
            <span className="eyebrow">{agentic.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl">
              {agentic.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-2xl text-muted">{agentic.sub}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <MagneticButton
                href={agentic.ctaPrimary.href}
                ariaLabel={`${agentic.ctaPrimary.label} (opens booking form in a new tab)`}
              >
                {agentic.ctaPrimary.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </MagneticButton>
              <MagneticButton variant="outline" href={agentic.ctaSecondary.href}>
                {agentic.ctaSecondary.label}
              </MagneticButton>
            </div>
          </Reveal>
        </div>

        {/* ---------- the 3-step flow ---------- */}
        <div className="space-y-20 md:space-y-28">
          {agentic.steps.map((step, i) => {
            const Icon = iconMap[step.icon] ?? iconMap.Sparkles;
            const mockRight = i % 2 === 0; // step 1 & 3 right, step 2 left

            return (
              <div
                key={step.id}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                {/* COPY column */}
                <motion.div
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                  transition={{ duration: 0.75, ease: EASE }}
                  className={cn(
                    "order-1",
                    mockRight ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-4xl tabular-nums leading-none text-faint md:text-5xl">
                      {step.n}
                    </span>
                    <span className="rounded-xl border border-line bg-surface p-2.5 text-accent-bright">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-muted">
                    {step.copy}
                  </p>
                </motion.div>

                {/* MOCK column */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
                  className={cn(
                    "order-2",
                    mockRight ? "lg:order-2" : "lg:order-1",
                  )}
                >
                  <StepMock step={step} />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
