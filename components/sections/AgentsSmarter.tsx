"use client";

import { smarter } from "@/lib/content";
import { iconMap } from "@/components/icon-map";
import { cn } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

/* ============================================================
   AGENTS THAT GET SMARTER — the compounding-intelligence payoff.
   Three differentiator cards feeding one shared brain.
   ============================================================ */

export function AgentsSmarter() {
  return (
    <section id="smarter" className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      <div className="shell relative">
        {/* HEADER */}
        <div className="mb-12 max-w-2xl md:mb-16">
          <Reveal>
            <p className="eyebrow">{smarter.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 font-display text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
              {smarter.title}
            </h2>
          </Reveal>
        </div>

        {/* CARDS */}
        <Stagger className="grid gap-6 md:grid-cols-3">
          {smarter.cards.map((card) => (
            <StaggerItem key={card.title} className="h-full">
              <SmartCard card={card} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------- one differentiator card ---------- */

function SmartCard({ card }: { card: (typeof smarter.cards)[number] }) {
  const Icon = iconMap[card.icon] ?? iconMap.Sparkles;

  return (
    <div
      className={cn(
        "card group relative flex h-full flex-col overflow-hidden rounded-2xl p-8",
        "transition-colors duration-300 hover:border-line-strong",
      )}
    >
      {/* soft accent glow — intensifies on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />
      {/* top hairline glint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
      />

      {/* icon tile */}
      <span
        className={cn(
          "relative inline-flex w-fit rounded-xl bg-accent/10 p-3 text-accent-bright",
          "ring-1 ring-inset ring-accent/20",
          "transition-shadow duration-300 group-hover:shadow-[0_0_28px_-6px_rgba(99,102,241,0.55)]",
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>

      {/* title */}
      <h3 className="relative mt-6 font-display text-xl leading-snug text-ink md:text-2xl">
        {card.title}
      </h3>

      {/* body */}
      {card.body ? (
        <p className="relative mt-3 leading-relaxed text-muted">{card.body}</p>
      ) : null}
    </div>
  );
}
