"use client";

import { positioning } from "@/lib/content";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

/**
 * Positioning — the repositioning beat, placed right after the hero.
 * A big editorial statement, a supporting frame, and the recurring
 * "You build. We grow." mic-drop motif. High-contrast, cinematic.
 */
export function Positioning() {
  // Emphasize the pivot phrase inside the statement for rhythm.
  const EMPHASIS = "You don't need another one.";
  const idx = positioning.statement.indexOf(EMPHASIS);
  const statementBefore =
    idx >= 0 ? positioning.statement.slice(0, idx) : positioning.statement;
  const statementAfter =
    idx >= 0 ? positioning.statement.slice(idx + EMPHASIS.length) : "";

  const [motifTop, motifBottom] = positioning.motif;

  return (
    <section
      id="positioning"
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
    >
      {/* low accent wash anchored beneath the mic-drop line */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent)_20%,transparent)_0%,transparent_70%)] blur-3xl"
      />

      <div className="shell">
        <div className="max-w-4xl">
          {/* eyebrow with a small accent mark */}
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_2px_color-mix(in_oklab,var(--color-accent)_60%,transparent)]"
              />
              {positioning.eyebrow}
            </p>
          </Reveal>

          {/* the large editorial statement — the section heading */}
          <Reveal delay={0.08}>
            <h2 className="mt-8 font-display font-medium leading-[1.05] tracking-tight text-3xl sm:text-5xl lg:text-6xl">
              <span className="text-ink">{statementBefore}</span>
              {idx >= 0 && (
                <>
                  <span className="text-gradient">{EMPHASIS}</span>
                  <span className="text-muted">{statementAfter}</span>
                </>
              )}
            </h2>
          </Reveal>

          {/* body — the throughput explanation */}
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {positioning.body}
            </p>
          </Reveal>

          {/* support — a distinct, slightly larger line with an accent hairline */}
          <Reveal delay={0.24}>
            <div className="relative mt-8 max-w-2xl">
              <span
                aria-hidden
                className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px bg-gradient-to-b from-accent/70 via-accent/30 to-transparent"
              />
              <p className="pl-6 text-xl leading-relaxed text-ink sm:text-2xl">
                {positioning.support}
              </p>
            </div>
          </Reveal>

          {/* the recurring mic-drop motif — two lines rising in sequence */}
          <Stagger className="mt-16">
            <h3 className="font-display font-medium leading-[0.98] tracking-tight text-4xl sm:text-6xl lg:text-7xl">
              <StaggerItem>
                <span className="block text-ink">{motifTop}</span>
              </StaggerItem>
              <StaggerItem>
                <span className="block text-gradient">{motifBottom}</span>
              </StaggerItem>
            </h3>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
