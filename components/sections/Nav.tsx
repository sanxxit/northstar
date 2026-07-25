"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { nav } from "@/lib/content";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // In-page anchors on home; route back to home + anchor on service pages.
  const pathname = usePathname();
  const onHome = pathname === "/";
  const sectionHref = (h: string) => (onHome ? h : `/${h}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header id="nav" className="fixed inset-x-0 top-0 z-50">
      {/* animated glass backdrop — fades in once scrolled past the hero lip */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 border-b border-line bg-bg/70 backdrop-blur-xl"
        initial={false}
        animate={{ opacity: scrolled || open ? 1 : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      />

      <div className="shell relative">
        <div className="flex h-16 items-center justify-between md:h-18">
          {/* LEFT — wordmark + accent mark */}
          <a
            href={onHome ? "#hero" : "/"}
            className="group relative flex items-center gap-2.5"
            aria-label="Northstar — home"
            onClick={() => setOpen(false)}
          >
            <span className="relative inline-flex h-2 w-2 shrink-0">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-accent blur-[6px] opacity-80 animate-pulse-glow"
              />
              <span
                aria-hidden
                className="relative h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(99,102,241,0.7)]"
              />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              Northstar
            </span>
          </a>

          {/* CENTER — primary links with underline-grow on hover */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 md:flex"
          >
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={sectionHref(link.href)}
                className="group relative text-sm text-muted transition-colors duration-300 hover:text-ink"
              >
                {link.label}
                <span
                  aria-hidden
                  className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100"
                />
              </a>
            ))}
          </nav>

          {/* RIGHT — ghost login + primary CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href={nav.loginHref}
              className="hidden text-sm text-muted transition-colors duration-300 hover:text-ink sm:inline-flex"
            >
              Log in
            </a>

            <div className="hidden md:block">
              <MagneticButton
                href={nav.cta.href}
                ariaLabel={`${nav.cta.label} (opens booking form in a new tab)`}
              >
                {nav.cta.label}
              </MagneticButton>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-line-strong hover:bg-elevated md:hidden",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="x"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <Menu className="h-5 w-5" aria-hidden />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE — full-screen overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col bg-bg/95 backdrop-blur-2xl md:hidden"
          >
            <div
              aria-hidden
              className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-30"
            />
            <nav
              aria-label="Mobile"
              className="relative flex flex-1 flex-col justify-center gap-1 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24"
            >
              {nav.links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={sectionHref(link.href)}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.05 + i * 0.06 }}
                  className="group flex items-center justify-between border-b border-line py-4 font-display text-2xl text-ink"
                >
                  {link.label}
                  <ArrowUpRight
                    aria-hidden
                    className="h-5 w-5 text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-active:text-accent-bright"
                  />
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: EASE,
                  delay: 0.05 + nav.links.length * 0.06,
                }}
                className="mt-8 flex flex-col gap-4"
              >
                <a
                  href={nav.loginHref}
                  onClick={() => setOpen(false)}
                  className="py-2 text-base text-muted transition-colors duration-200 hover:text-ink"
                >
                  Log in
                </a>
                <MagneticButton
                  href={nav.cta.href}
                  ariaLabel={`${nav.cta.label} (opens booking form in a new tab)`}
                  className="w-full justify-center py-4 text-base"
                  onClick={() => setOpen(false)}
                >
                  {nav.cta.label}
                </MagneticButton>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
