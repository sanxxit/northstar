import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getService } from "@/lib/services";
import { Check } from "@/components/icon-map";
import { cn } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { FlowStepper } from "@/components/services/FlowStepper";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ExampleCard } from "@/components/services/ExampleCard";

/** Shared anatomy for all 8 service pages. The unique data-viz is passed in. */
export function ServicePage({ slug, viz }: { slug: string; viz: ReactNode }) {
  const s = getService(slug);
  if (!s) notFound();

  const beats = [
    { label: "The tension", body: s.story.tension },
    { label: "The shift", body: s.story.shift },
    { label: "The outcome", body: s.story.outcome },
  ];

  return (
    <article className="relative">
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden pb-14 pt-32 md:pb-20 md:pt-40">
        <div className="shell max-w-4xl">
          <Reveal y={14}>
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden />
              Northstar
            </Link>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="eyebrow mt-8 text-accent-bright">{s.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-4 max-w-3xl font-display font-medium leading-[1.02] tracking-tight text-[clamp(2.25rem,6vw,4rem)]">
              {s.h1}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {s.subhead}
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-9">
              <ServiceCTA />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- STORY (3 beats) ---------- */}
      <section className="py-14 md:py-24">
        <div className="shell">
          <Stagger className="grid gap-8 md:grid-cols-3 md:gap-10">
            {beats.map((b) => (
              <StaggerItem key={b.label} className="relative">
                <div
                  aria-hidden
                  className="mb-4 h-px w-10 bg-gradient-to-r from-accent to-transparent"
                />
                <p className="eyebrow mb-3">{b.label}</p>
                <p className="text-[15px] leading-relaxed text-muted md:text-base">
                  {b.body}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- WHAT YOU GET ---------- */}
      <section className="py-14 md:py-24">
        <div className="shell">
          <Reveal className="mb-10">
            <p className="eyebrow">What you get</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight md:text-4xl">
              Concrete, not fluff.
            </h2>
          </Reveal>
          <Stagger className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {s.whatYouGet.map((item) => (
              <StaggerItem
                key={item}
                className="flex items-start gap-3 border-t border-line py-4"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/10 text-accent-bright ring-1 ring-inset ring-accent/20">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
                <span className="text-[15px] leading-relaxed text-ink/90">
                  {item}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- HOW IT WORKS (flow) ---------- */}
      <section className="py-14 md:py-24">
        <div className="shell">
          <Reveal className="mb-12">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
              Brief in, live campaign out.
            </h2>
          </Reveal>
          <Reveal>
            <div className="card rounded-2xl p-6 sm:p-8 md:p-10">
              <FlowStepper steps={s.flow.steps} loop={s.flow.loop} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- PROOF (the one data-viz) ---------- */}
      <section id="proof" className="scroll-mt-24 py-14 md:py-24">
        <div className="shell">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal
              className={cn(
                "order-1",
                s.vizSide === "left" ? "lg:order-2" : "lg:order-1",
              )}
            >
              <p className="eyebrow text-accent-bright">The proof</p>
              <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl lg:text-5xl">
                {s.proof.heading}
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
                {s.proof.sub}
              </p>
            </Reveal>
            <Reveal
              delay={0.1}
              className={cn(
                "order-2",
                s.vizSide === "left" ? "lg:order-1" : "lg:order-2",
              )}
            >
              {viz}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- EXAMPLE ---------- */}
      <section className="py-14 md:py-24">
        <div className="shell max-w-3xl">
          <Reveal className="mb-8">
            <p className="eyebrow">An example</p>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
              What this looks like in the wild.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <ExampleCard text={s.example} />
          </Reveal>
        </div>
      </section>

      {/* ---------- CLOSING CTA ---------- */}
      <section className="py-24 md:py-32">
        <div className="shell max-w-3xl text-center">
          <Reveal>
            <h2 className="font-display font-medium leading-[1.05] tracking-tight text-[clamp(2rem,5vw,3.25rem)]">
              Ready to see it on <span className="text-gradient">your</span>{" "}
              account?
            </h2>
            <div className="mt-9 flex justify-center">
              <ServiceCTA center />
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
