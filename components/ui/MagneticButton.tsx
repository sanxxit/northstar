"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  strength?: number;
  ariaLabel?: string;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium tracking-tight transition-colors duration-300 outline-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white px-6 py-3 hover:bg-accent-deep shadow-[0_12px_44px_-12px_rgba(99,102,241,0.75)]",
  outline:
    "border border-line-strong text-ink px-6 py-3 hover:border-white/30 hover:bg-white/5",
  ghost: "text-muted px-4 py-2 hover:text-ink",
};

/**
 * Button/link with a subtle magnetic hover (follows the cursor, springs back).
 * Renders a <Link> when `href` is set, otherwise a <button>.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  strength = 0.35,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 14, mass: 0.4 });

  // Magnetic pull only on real pointer devices — never on touch.
  const [magnetic, setMagnetic] = useState(false);
  useEffect(() => {
    setMagnetic(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    if (!magnetic) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const cls = cn(base, variants[variant], className);
  const isExternal = !!href && /^https?:\/\//.test(href);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {href ? (
        isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cls}
            onClick={onClick}
            aria-label={ariaLabel}
          >
            {children}
          </a>
        ) : (
          <Link href={href} className={cls} onClick={onClick} aria-label={ariaLabel}>
            {children}
          </Link>
        )
      ) : (
        <button
          type="button"
          className={cls}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {children}
        </button>
      )}
    </motion.div>
  );
}
