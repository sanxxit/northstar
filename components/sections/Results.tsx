"use client";

import { Globe } from "lucide-react";
import { stats, proof } from "@/lib/content";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

export function Results() {
  return (
    <section
      id="results"
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
    >
      <div className="shell relative">
        {/* Header */}
        <Reveal className="mb-14 max-w-2xl">
          <p className="eyebrow text-accent-bright">{proof.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            {proof.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {proof.sub}
          </p>
        </Reveal>

        {/* Stats */}
        <Stagger className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="border-t border-line pt-6">
              <CountUp
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                decimals={s.decimals}
                className="font-display text-5xl font-semibold tracking-tight text-ink md:text-6xl"
              />
              <p className="mt-3 text-sm text-muted">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Honest geo credibility (regions, not fake logos) */}
        <Reveal className="mt-16 flex items-center justify-center gap-2.5 text-sm text-muted md:mt-20">
          <Globe className="h-4 w-4 text-faint" aria-hidden />
          {proof.regions}
        </Reveal>

        {/* System line */}
        <Reveal className="mt-6">
          <div className="card relative overflow-hidden rounded-2xl px-8 py-14 text-center md:py-20">
            <div
              aria-hidden
              className="bg-dots mask-fade pointer-events-none absolute inset-0 opacity-30"
            />
            <p className="relative font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl md:text-5xl">
              We build systems that{" "}
              <span className="text-gradient">show results.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
