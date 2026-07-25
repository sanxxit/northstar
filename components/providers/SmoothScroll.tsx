"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Drives the Lenis rAF loop from the GSAP ticker (single rAF) and keeps
 * ScrollTrigger perfectly in sync. Also intercepts in-page anchor clicks for
 * smooth navigation. Registered inside <ReactLenis root>.
 */
function LenisController() {
  const lenis = useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    if (!lenis) return;
    gsap.registerPlugin(ScrollTrigger);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -84 });
    };
    document.addEventListener("click", onClick);

    return () => {
      gsap.ticker.remove(onTick);
      document.removeEventListener("click", onClick);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  // Disable wheel smoothing under reduced motion (native scroll takes over).
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        duration: 1.1,
        smoothWheel: !reduce,
        touchMultiplier: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      <LenisController />
      {children}
    </ReactLenis>
  );
}
