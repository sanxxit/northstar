"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { footer } from "@/lib/content";

/**
 * ONE global ambient layer for the whole site — a quiet, faded, premium field
 * that every section floats on. Fixed behind all content (-z-10, pointer-events
 * none). Composed of: base + vignette, a masked grid, film grain, two soft
 * indigo auroras anchored (by scroll) behind the hero and the closing CTA, and
 * the signature wordmark used ONCE (the CTA scroll moment) — the footer keeps
 * its own. Tunable via the --amb-* CSS variables in globals.css.
 */

const NOISE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function AmbientBackground() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // opacities are scroll-linked (anchors the glows to hero / CTA); ceilings
  // stay under the spec limits (glow <=18%, wordmark <=4%).
  const heroGlowO = useTransform(scrollYProgress, [0, 0.14], [0.16, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -140]);

  const ctaGlowO = useTransform(scrollYProgress, [0.78, 0.93], [0, 0.15]);
  const ctaY = useTransform(scrollYProgress, [0.78, 1], [120, -30]);

  // signature wordmark — only around the closing CTA, gone before the footer.
  const markO = useTransform(scrollYProgress, [0.8, 0.9, 0.97], [0, 0.04, 0]);
  const markY = useTransform(scrollYProgress, [0.78, 1], [70, -70]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* base color */}
      <div className="absolute inset-0 bg-bg" />

      {/* faint top-glow behind the nav */}
      <div
        className="absolute inset-x-0 top-0 h-[38vh]"
        style={{
          background:
            "radial-gradient(70% 100% at 50% 0%, color-mix(in oklab, var(--color-accent) 9%, transparent), transparent 72%)",
          opacity: "var(--amb-glow-top)",
        }}
      />

      {/* masked grid — consistent across the whole page */}
      <div
        className="mask-fade absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,var(--amb-grid)) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,var(--amb-grid)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* soft vignette — darkens the edges so content pops toward center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 34%, transparent 45%, rgba(0,0,0,var(--amb-vignette)) 100%)",
        }}
      />

      {/* hero aurora (top) */}
      <motion.div
        style={{ opacity: heroGlowO, y: reduced ? 0 : heroY }}
        className="absolute left-1/2 top-[-20vh] h-[72vh] w-[92vw] max-w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent)_55%,transparent),transparent_66%)] blur-[80px] md:blur-[150px]"
      />

      {/* closing-CTA aurora (bottom) */}
      <motion.div
        style={{ opacity: ctaGlowO, y: reduced ? 0 : ctaY }}
        className="absolute bottom-[-14vh] left-1/2 h-[64vh] w-[92vw] max-w-[960px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent)_50%,transparent),transparent_66%)] blur-[80px] md:blur-[150px]"
      />

      {/* signature wordmark — the ONE non-footer moment (closing CTA) */}
      <motion.div
        style={{ opacity: markO, y: reduced ? 0 : markY }}
        className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center"
      >
        <span className="select-none whitespace-nowrap font-display text-[20vw] font-bold leading-none tracking-tighter text-ink">
          {footer.wordmark}
        </span>
      </motion.div>

      {/* film grain — unifies the surface, kills banding */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${NOISE}")`,
          backgroundSize: "150px 150px",
          opacity: "var(--amb-grain)",
        }}
      />
    </div>
  );
}
