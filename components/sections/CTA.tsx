"use client";

import { ArrowRight } from "lucide-react";
import { closing, positioning, pricing } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * The climactic closing CTA band. Anchored at #book so the nav
 * "Book a demo" scrolls here. Rich aurora background, the recurring
 * "You build. We grow." motif, one magnetic primary CTA, and a reassurance line.
 */
export function CTASection() {
  return (
    <section
      id="book"
      className="relative overflow-hidden py-32 md:py-48"
    >
      {/* Transparent — the global ambient (CTA aurora + signature wordmark)
          shows through; we only add one soft local glow + seam blends. */}
      <div aria-hidden className="absolute inset-0">
        <div className="animate-float-slow absolute left-1/2 top-1/2 h-[32rem] w-[42rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[110px]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          {/* framed inset panel for depth */}
          <div className="glass relative mx-auto overflow-hidden rounded-3xl border border-line px-6 py-16 sm:px-12 sm:py-20 lg:py-24">
            {/* soft accent halo behind the headline, inside the panel */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[90px]"
            />

            <div className="relative">
              <p className="eyebrow text-accent-bright">{closing.subtitle}</p>

              <h2 className="mt-6 font-display font-medium leading-[1.0] text-5xl sm:text-6xl lg:text-8xl text-ink">
                <span className="block">{positioning.motif[0]}</span>
                <span className="text-gradient block">{positioning.motif[1]}</span>
              </h2>

              <div className="mt-10 flex justify-center">
                <MagneticButton
                  href={closing.cta.href}
                  ariaLabel={`${closing.cta.label} (opens booking form in a new tab)`}
                  className="px-8 py-4 text-base"
                >
                  {closing.cta.label}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </MagneticButton>
              </div>

              <p className="mt-6 text-sm text-muted">{pricing.subtitle}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
