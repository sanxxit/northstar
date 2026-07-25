"use client";

import { Check } from "lucide-react";
import { pricing } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32 lg:py-40">
      <div className="shell">
        {/* header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow">{pricing.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl">
              {pricing.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 text-base text-muted md:text-lg">
              {pricing.subtitle}
            </p>
          </Reveal>
        </div>

        {/* cards */}
        <Stagger className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {pricing.cards.map((card) => (
            <StaggerItem key={card.name} className="flex">
              <div
                className={cn(
                  "relative flex w-full flex-col rounded-2xl border p-8 md:p-10",
                  card.highlighted
                    ? "border-accent/50 bg-surface-2 glow-accent"
                    : "card border-line bg-surface",
                )}
              >
                {card.highlighted && (
                  <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.8)] md:left-10">
                    Most popular
                  </span>
                )}

                {/* tagline */}
                <p
                  className={cn(
                    "eyebrow",
                    card.highlighted ? "text-accent" : "text-muted",
                  )}
                >
                  {card.tagline}
                </p>

                {/* name */}
                <h3 className="mt-2 font-display text-2xl md:text-3xl">
                  {card.name}
                </h3>

                {/* desc */}
                <p className="mt-2 text-muted">{card.desc}</p>

                {/* divider */}
                <div className="my-6 border-t border-line" />

                {/* features */}
                <ul className="space-y-3">
                  {card.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          card.highlighted
                            ? "bg-accent/15"
                            : "bg-elevated border border-line",
                        )}
                      >
                        <Check className="h-3.5 w-3.5 text-accent" aria-hidden />
                      </span>
                      <span className="text-sm leading-relaxed text-ink">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* cta */}
                <div className="mt-auto pt-8">
                  <MagneticButton
                    href={card.cta.href}
                    ariaLabel={`${card.cta.label} (opens booking form in a new tab)`}
                    variant={card.highlighted ? "primary" : "outline"}
                    className="w-full"
                  >
                    {card.cta.label}
                  </MagneticButton>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
