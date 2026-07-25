# Northstar — Design System (locked)

The brand is **dark, precise, engineered** — Linear/Vercel discipline, not a v0 default.
Every section holds these decisions. Do not fall back to generic defaults.

## Positioning (drives content order)
Northstar is an **AI-native growth AGENCY first** (done-for-you: we plan, run, and
optimize growth and use AI + agents to beat a traditional agency on speed and results),
and an **AI agent product/platform second** ("…or run it yourself"). Lead with agency
outcomes; introduce the self-serve platform later. In pricing, **Managed = primary /
"Most popular"**, Platform = secondary.

## Language
**American English only.** optimize / optimization / analyze / personalize / color /
center / catalog. Never British spellings. Copy is founder-to-founder: confident,
specific, no hedging. Every headline must fail the competitor-swap test (a line that
still reads fine with a competitor's name swapped in is too generic — rewrite it).

## Audience / market
US-first (startups, mid-size, D2C/e-commerce, B2B), plus UK, Europe, Australia, Middle
East, Singapore, Japan. **Not India.** Pricing in **USD**. Geo credibility = regions,
never fake company logos. Only claim compliance that's true → honest form:
"Enterprise-grade security · GDPR-ready · SSO available."

## Color (tokens in app/globals.css @theme)
| token | value | use |
|---|---|---|
| `--color-bg` | `#08090C` | page base |
| `--color-surface` / `--color-surface-2` / `--color-elevated` | `#0F1116` / `#14161C` / `#191C24` | layered depth (real depth, not uniform glass) |
| `--color-ink` / `--color-muted` / `--color-faint` | `#F5F6F8` / `#9AA0AA` / `#6A707C` | text |
| `--color-accent` / `--color-accent-bright` / `--color-accent-deep` | `#6366F1` / `#818CF8` / `#4F46E5` | electric indigo |
| `--color-line` / `--color-line-strong` | `rgba(255,255,255,.08 / .14)` | hairline borders (the default separator — NOT glow) |

**Accent glow is RARE and intentional.** Allowed only on: the primary CTA, the active
pipeline node, and one hero moment (the live agent panel). Everywhere else use quiet
hairline borders + layered surfaces for depth. No uniform neon-on-glass.

## Type
- **Display** — `Space Grotesk` (`--font-display`): headlines, tight tracking (`-0.02em`), weights 500–600.
- **Serif accent** — `Instrument Serif` italic (`--font-serif`): ONE editorial emphasis per
  hero / big moment, used sparingly for personality (the Stripe move). Never body.
- **Body/UI** — `Inter` (`--font-sans`).
- **Mono** — `JetBrains Mono` (`--font-mono`): technical labels, counters, node numbers.
- Scale is dramatic via `clamp()` so display lines never overflow on mobile (375–430px).

## Texture & spacing
- Film grain overlay ~4% (global). Faint dot/grid in **1–2 sections only**.
- **8pt spacing rhythm.** Section padding: desktop `py-24 md:py-32 lg:py-40`; mobile ~`py-16` (64–80px).
- Real layered shadows for depth; hairline borders as the default divider.

## Motion
- Easing `cubic-bezier(.22,1,.36,1)`, durations 0.4–0.9s.
- **Varied** reveals (stagger / mask-clip / slide) — never the identical fade on every element.
- Every hover **does something**: magnetic CTA, card lift + `border-accent`, cursor-aware
  tilt. **Touch devices**: no magnetic / no tilt; lighten heavy effects.
- Smooth scroll: **Lenis** (`ReactLenis root`) driving **GSAP ScrollTrigger** in sync.
- Respect `prefers-reduced-motion` with a calm, fully-visible fallback everywhere.

## Anti-slop rules (score every section)
No floating gradient orb (hero shows the **product/agent working**). No Inter-only type.
No glow-everywhere. No uniform 3×3 grids (use a **true bento** with varied tiles + one
live-demo tile). No dead hovers. No identical fades. No fake logos/testimonials.

## Mobile (first-class, 375 / 390 / 430px)
Hamburger → full-screen overlay menu. `clamp()` type. The loop → **vertical stepper**
(not a squished ring). Bento & 3-up → single column. Pricing stacks; "Most popular"
stays distinct. Touch targets ≥44px; safe-area insets; no horizontal overflow; lazy/paused offscreen media.
