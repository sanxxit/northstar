"use client";

import type { ComponentType, SVGProps } from "react";

import { footer, site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

/* -------------------------------------------------------------------------- */
/* Inline brand SVGs — lucide 1.x has no brand icons, so we hand-roll them.    */
/* -------------------------------------------------------------------------- */

type BrandIcon = ComponentType<SVGProps<SVGSVGElement>>;

const XIcon: BrandIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20} {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

const LinkedInIcon: BrandIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20} {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
  </svg>
);

const GitHubIcon: BrandIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20} {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const socialMap: Record<
  string,
  { label: string; Icon: BrandIcon }
> = {
  x: { label: "Follow Northstar on X", Icon: XIcon },
  linkedin: { label: "Northstar on LinkedIn", Icon: LinkedInIcon },
  github: { label: "Northstar on GitHub", Icon: GitHubIcon },
};

/* -------------------------------------------------------------------------- */

export function Footer() {
  const tagline =
    site.positioning || "One brief in. A thousand experiments out.";

  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-line pt-24 pb-12"
    >
      {/* Signature giant wordmark (footer moment) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-[6vw] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[26vw] font-bold leading-none tracking-tight text-ink/[0.025]">
          {footer.wordmark}
        </div>
        {/* soft accent glow anchoring the section */}
        <div className="absolute -top-24 left-1/2 h-64 w-[42rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="shell relative">
        <Reveal>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <a
                href="#top"
                className="inline-flex items-center gap-2 font-display text-xl font-semibold text-ink transition-colors hover:text-accent-bright"
              >
                <span
                  aria-hidden
                  className="grid h-6 w-6 place-items-center rounded-md bg-accent/15 ring-1 ring-inset ring-accent/30"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-bright shadow-[0_0_12px_var(--color-accent)]" />
                </span>
                {footer.wordmark}
              </a>

              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                {footer.mission}
              </p>

              <ul className="mt-6 flex gap-3">
                {footer.socials.map((key) => {
                  const social = socialMap[key];
                  if (!social) return null;
                  const { label, Icon } = social;
                  return (
                    <li key={key}>
                      <a
                        href="#"
                        aria-label={label}
                        className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:border-line-strong hover:text-ink"
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Link columns */}
            {footer.columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-faint">
                  {column.title}
                </p>
                <ul className="space-y-3">
                  {column.links.map((link) => {
                    const external = /^https?:\/\//.test(link.href);
                    return (
                      <li key={`${column.title}-${link.label}`}>
                        <a
                          href={link.href}
                          {...(external
                            ? {
                                target: "_blank",
                                rel: "noopener noreferrer",
                                "aria-label": `${link.label} (opens booking form in a new tab)`,
                              }
                            : {})}
                          className="text-sm text-muted transition-colors hover:text-ink"
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div
          className={cn(
            "mt-16 flex flex-col items-center justify-between gap-4 border-t border-line pt-8",
            "sm:flex-row",
          )}
        >
          <p className="text-sm text-faint">{footer.legal}</p>
          <p className="text-sm text-faint">{tagline}</p>
        </div>
      </div>
    </footer>
  );
}
