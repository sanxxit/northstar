"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { footer } from "@/lib/content";

/**
 * ONE global ambient layer for the whole site — a quiet, faded, premium field
 * that every section floats on. Fixed behind all content (-z-10, pointer-events
 * none). Composed of: base + vignette, a masked grid, film grain, two soft
 * indigo auroras (behind the hero and the closing CTA), and the signature
 * "Northstar" wordmark that reveals at EVERY fold transition — it fades in as a
 * section boundary crosses the viewport while you scroll, then fades out once
 * the fold settles. Tunable via the --amb-* CSS variables in globals.css.
 */

const NOISE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

// peak opacity of the per-fold wordmark reveal
const MARK_MAX = 0.05;

export function AmbientBackground() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();

  // soft auroras anchored (by scroll) behind the hero and the closing CTA
  const heroGlowO = useTransform(scrollYProgress, [0, 0.14], [0.16, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -140]);
  const ctaGlowO = useTransform(scrollYProgress, [0.78, 0.93], [0, 0.15]);
  const ctaY = useTransform(scrollYProgress, [0.78, 1], [120, -30]);

  // ---- per-fold signature wordmark ----
  const markOpacity = useMotionValue(0);
  const markShift = useMotionValue(0);
  const boundaries = useRef<number[]>([]);

  // Peak the wordmark when the nearest section boundary is near the viewport
  // center (i.e. mid-transition between two folds); fade it out otherwise.
  const updateMark = useCallback(
    (y: number) => {
      const bs = boundaries.current;
      if (reduced || !bs.length) {
        markOpacity.set(0);
        markShift.set(0);
        return;
      }
      const vh = window.innerHeight || 1;
      const probe = y + vh * 0.5; // viewport center, in document coords
      let nearest = Infinity;
      let signed = 0;
      for (const b of bs) {
        const dd = probe - b;
        if (Math.abs(dd) < Math.abs(nearest)) {
          nearest = Math.abs(dd);
          signed = dd;
        }
      }
      const sigma = vh * 0.34; // reveal window
      const t = MARK_MAX * Math.exp(-((nearest / sigma) ** 2));
      markOpacity.set(t);
      // subtle drift so the reveal feels alive (opposes scroll direction)
      markShift.set((signed / vh) * 26);
    },
    [reduced, markOpacity, markShift],
  );

  useMotionValueEvent(scrollY, "change", updateMark);

  // (re)measure section boundaries on mount, resize, content-height change,
  // and route change (the layout — and this component — persist across routes).
  useEffect(() => {
    const measure = () => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("section, footer#footer"),
      );
      const tops: number[] = [];
      for (const el of els) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (!tops.length || Math.abs(top - tops[tops.length - 1]) > 8) {
          tops.push(top);
        }
      }
      boundaries.current = tops;
      updateMark(window.scrollY);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    const t = window.setTimeout(measure, 300);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, [pathname, updateMark]);

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

      {/* signature wordmark — reveals at every fold transition */}
      <motion.div
        style={{ opacity: markOpacity, y: markShift }}
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
