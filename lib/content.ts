/**
 * NORTHSTAR — single source of truth for all site copy & data.
 * Positioning: an AI-native growth AGENCY first (done-for-you, results-led),
 * and an AI agent product/platform second ("…or run it yourself").
 * American English throughout. Pricing in USD. Regions, never fake logos.
 * Icons are referenced by string key; resolve with `iconMap`.
 */

/**
 * Single source of truth for the demo / booking form.
 * Every conversion CTA ("Book a demo", "Get started", "Request access",
 * the nav + mobile-menu CTA, and footer "Contact") points here.
 * Change it in one place — or set NEXT_PUBLIC_DEMO_URL.
 */
export const DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL ?? "https://forms.gle/Lo6EvgftoZaoTZaS7";

export const site = {
  name: "Northstar",
  domain: "northstar.ai",
  positioning: "Your AI growth hire.",
  bookingUrl: DEMO_URL,
  ctaPrimary: "Book a demo",
  ctaSecondary: "See how it works",
  compliance: "Enterprise-grade security · GDPR-ready · SSO available",
  regions: "Growth teams across the US, UK, Europe & APAC",
} as const;

export const nav = {
  links: [
    { label: "How it works", href: "#how" },
    { label: "What we do", href: "#capabilities" },
    { label: "Results", href: "#results" },
    { label: "Pricing", href: "#pricing" },
  ],
  loginHref: "#login",
  cta: { label: "Book a demo", href: DEMO_URL },
} as const;

export const hero = {
  eyebrow: "AI-native growth agency",
  // second line takes the serif italic accent
  h1Lines: ["Your AI", "growth hire."],
  kicker: "One brief in. A thousand experiments out.",
  subhead:
    "We plan, run, and optimize your entire growth engine — ads, creative, landing pages, and SEO — with AI-powered operators that ship faster and optimize harder than a traditional agency.",
  icp: "Built for startups, D2C brands, and B2B growth teams across the US, UK, Europe & APAC.",
  compliance: "Enterprise-grade security · GDPR-ready · SSO available",
  ctaPrimary: { label: "Book a demo", href: DEMO_URL },
  ctaSecondary: { label: "See how it works", href: "#how" },
  ticker: [
    "3.4× average ROAS lift",
    "72h from brief to live",
    "500+ ad variants per campaign",
    "24/7 always-on optimization",
  ],
  // the live "agent at work" panel that replaces the old hero orb
  panel: {
    agent: "Northstar agent",
    status: "Running",
    brief:
      "Launch our Q2 pricing page for mid-market RevOps. Lead with the speed promise, keep our voice, and pull product shots from the brand.",
    chips: ["Audience", "Copy", "Layout", "Brand check"],
    deploy: [
      { asset: "Landing page", tool: "HubSpot" },
      { asset: "Ad set", tool: "LinkedIn" },
      { asset: "Email", tool: "HubSpot" },
    ],
    done: "Campaign live in 72h",
  },
} as const;

export const positioning = {
  eyebrow: "Why Northstar",
  statement:
    "Your marketing stack already has hundreds of tools. You don't need another one.",
  body: "You already know what a good campaign looks like. You have the ideas, the audience, and the tools to execute. The problem is throughput — there are always more campaigns to run than your team has time to click through.",
  support:
    "All the growth work you know you should do but never get to — SEO, ads, outbound, social, A/B tests. We run it, and we optimize it.",
  motif: ["You build.", "We grow."],
} as const;

/* ---------- the agentic 3-step flow (how the agency delivers) ---------- */

export type BriefCard = {
  label: string;
  state: string;
  text: string;
  chips: string[];
};

export type DeployPlan = {
  header: string;
  action: string;
  rows: { asset: string; dest: string }[];
  caption: string;
};

export type AgenticStep = {
  n: string;
  id: string;
  icon: string;
  title: string;
  copy: string;
  brief?: BriefCard;
  brandTicks?: string[];
  plan?: DeployPlan;
};

export const agentic = {
  eyebrow: "How we deliver",
  heading: "Ship campaigns in hours, not weeks.",
  sub: "Brief in. Live campaign out. Our operators run the agents and deploy straight into HubSpot, Marketo, and LinkedIn — no decks, no handoffs.",
  ctaPrimary: { label: "Book a demo", href: DEMO_URL },
  ctaSecondary: { label: "See it run", href: "#book" },
  steps: [
    {
      n: "01",
      id: "data",
      icon: "Database",
      title: "Data",
      copy: "We identify and enrich the right audience for your campaign — segmented, scored, and ready.",
      brief: {
        label: "Brief",
        state: "Generating…",
        text: "Launch our Q2 pricing page aimed at mid-market RevOps. Lead with the speed promise. Use our voice — direct, no jargon. Pull product shots from the design brain.",
        chips: ["Audience", "Copy", "Layout", "Brand check"],
      },
    },
    {
      n: "02",
      id: "design",
      icon: "Palette",
      title: "Design",
      copy: "AI-generated creative, reviewed against your brand guidelines. Every email, banner, and asset — 100% on-brand.",
      brandTicks: ["Tone", "Colors", "Logo lockup"],
      plan: {
        header: "5 assets approved · 4 destinations",
        action: "Deploy all",
        rows: [
          { asset: "Email", dest: "HubSpot" },
          { asset: "Landing Page", dest: "HubSpot" },
          { asset: "Ad Set", dest: "LinkedIn Ads" },
        ],
        caption: "Live in your stack",
      },
    },
    {
      n: "03",
      id: "deploy",
      icon: "Rocket",
      title: "Deployment",
      copy: "Our agents operate your tools — Responsys, Marketo, Salesforce Marketing Cloud — and get campaigns live. No manual clicking. No bottlenecks.",
    },
  ] satisfies AgenticStep[],
} as const;

/* ---------- "What we do" — true bento ---------- */

export type Capability = {
  label: string;
  icon: string;
  note: string;
  href: string;
  featured?: boolean;
};

export const capabilities = {
  eyebrow: "What we do",
  title: "One partner. The entire growth stack.",
  sub: "From first-touch research to last-click optimization. For D2C brands: creative volume, ROAS, and CAC. For B2B teams: pipeline, outbound, and AEO.",
  items: [
    {
      label: "AI performance marketing",
      icon: "Gauge",
      note: "Bids, budgets, and creative optimized 24/7 across Meta, Google, TikTok, Snapchat, Reddit & LinkedIn.",
      href: "/performance-marketing",
      featured: true,
    },
    {
      label: "AI video & static ads",
      icon: "Video",
      note: "Hundreds of on-brand variants from a single brief.",
      href: "/ad-creative",
    },
    {
      label: "AEO — SEO for LLMs",
      icon: "Bot",
      note: "Rank on Google and get cited by ChatGPT, Claude & Perplexity.",
      href: "/aeo",
    },
    {
      label: "Full-funnel dashboards",
      icon: "LayoutDashboard",
      note: "One live view across Meta, Google, LinkedIn & TikTok.",
      href: "/dashboards",
    },
    {
      label: "Lead generation, fully optimized",
      icon: "Users",
      note: "Pipeline for B2B; ROAS and CAC for D2C.",
      href: "/lead-generation",
    },
    {
      label: "Market research",
      icon: "Radar",
      note: "Competitor teardowns and live angle detection.",
      href: "/market-research",
    },
    {
      label: "Agentic marketing",
      icon: "Workflow",
      note: "Agents that operate your existing tools, end to end.",
      href: "/agentic",
    },
    {
      label: "Full-funnel marketing",
      icon: "Layers",
      note: "Research to revenue — one system.",
      href: "/full-funnel",
    },
  ] satisfies Capability[],
} as const;

/* ---------- "Agents that get smarter" ---------- */

export type SmartCard = { title: string; body: string; icon: string };

export const smarter = {
  eyebrow: "Compounding intelligence",
  title: "Agents that get smarter every week.",
  cards: [
    {
      title: "Gets you ranking in AI + Google.",
      body: "Posts drafted in your voice, built to rank on Google and get recommended by ChatGPT, Claude, and Perplexity.",
      icon: "ScanSearch",
    },
    {
      title: "Finds new customers, not just leads.",
      body: "We prospect net-new audiences, qualify them, and warm them up — not just harvest the demand you already have.",
      icon: "Users",
    },
    {
      title: "Gets smarter every week.",
      body: "If a topic ranks, ads pick it up. If a cold email gets replies, it becomes next week's blog. One agent, one shared brain.",
      icon: "Brain",
    },
  ] satisfies SmartCard[],
} as const;

/* ---------- the full-funnel loop ---------- */

export type EngineStage = {
  id: string;
  label: string;
  icon: string;
  headline: string;
  line: string;
};

export const engine = {
  eyebrow: "The full-funnel loop",
  title: "One loop. Five stages. Compounding forever.",
  lead: "We design, launch, and optimize your campaigns across every major channel, end to end.",
  channels: ["Google", "Meta", "LinkedIn", "TikTok", "Snapchat", "Reddit", "AI SEO"],
  optimize:
    "We run ads, launch campaigns, then optimize continuously — improving targeting, bids, creative, and landing pages from live campaign and conversion data.",
  stages: [
    {
      id: "research",
      label: "Research",
      icon: "Radar",
      headline: "Read the market first.",
      line: "Top ads, trends, and competitor angles, analyzed in real time — before you spend a dollar.",
    },
    {
      id: "create",
      label: "Create",
      icon: "Sparkles",
      headline: "Hundreds of on-brand ads.",
      line: "Static and video variants from one brief — each tuned to a specific hook and audience.",
    },
    {
      id: "launch",
      label: "Launch",
      icon: "Rocket",
      headline: "Live everywhere in one click.",
      line: "Google, Meta, LinkedIn, TikTok, Snapchat, Reddit, and AI SEO — pixels, UTMs, and compliance handled.",
    },
    {
      id: "optimize",
      label: "Optimize",
      icon: "Gauge",
      headline: "Budget follows performance.",
      line: "24/7. Winners scale, losers die — automatically, without a human touching a dashboard.",
    },
    {
      id: "learn",
      label: "Learn",
      icon: "Brain",
      headline: "Every campaign feeds the next.",
      line: "The system compounds. Your advantage grows while you sleep.",
    },
  ] satisfies EngineStage[],
} as const;

/* ---------- proof / results ---------- */

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
};

export const proof = {
  eyebrow: "Results",
  title: "Teams doing more with less.",
  sub: "Real results from startups, D2C brands, and B2B growth teams using Northstar to run ads and SEO with more speed and less chaos.",
  regions: "Growth teams across the US, UK, Europe & APAC",
  systemLine: "We build systems that show results.",
} as const;

export const stats: Stat[] = [
  { value: 3.4, suffix: "×", decimals: 1, label: "Average ROAS lift" },
  { value: 72, suffix: "h", label: "From brief to live" },
  { value: 500, suffix: "+", label: "Ad variants per campaign" },
];

/* ---------- compounding advantage ---------- */

export const compounding = {
  eyebrow: "The compounding advantage",
  title: "Most tools start from zero. We start from memory.",
  body: "Every launch teaches the system what works for your brand, your audience, your market. Winning angles, hooks, and creatives become the foundation for the next campaign — so your performance compounds while competitors start over.",
  points: [
    "Every campaign feeds a shared brand memory",
    "Winning patterns get reused and remixed",
    "Your advantage grows every single week",
  ],
  growth: [3, 6, 11, 18, 27, 40],
} as const;

/* ---------- how we work / pricing (Managed = primary) ---------- */

export type PricingCard = {
  name: string;
  tagline: string;
  desc: string;
  features: string[];
  cta: { label: string; href: string };
  highlighted: boolean;
};

export const pricing = {
  eyebrow: "How we work",
  title: "Let us run it — or run it yourself.",
  subtitle: "Month-to-month, priced in USD. No lock-in. Cancel anytime.",
  cards: [
    {
      name: "Managed",
      tagline: "Done-for-you agency",
      desc: "Our AI-powered growth operators plan, run, and optimize everything for you.",
      features: [
        "A dedicated growth strategist",
        "Done-for-you research, creative & landing pages",
        "One-click multichannel launch",
        "Always-on optimization & weekly reviews",
      ],
      cta: { label: "Book a demo", href: DEMO_URL },
      highlighted: true,
    },
    {
      name: "Platform",
      tagline: "Run it yourself",
      desc: "The same agents, for teams who'd rather run growth in-house.",
      features: [
        "Full access to the Northstar agents",
        "Research, creative & landing pages",
        "One-click multichannel launch",
        "Seats for your whole team",
      ],
      cta: { label: "Request access", href: DEMO_URL },
      highlighted: false,
    },
  ] satisfies PricingCard[],
} as const;

export const closing = {
  title: "You build. We grow.",
  subtitle: "Ready to put your growth on autopilot?",
  cta: { label: "Book a demo", href: DEMO_URL },
} as const;

export const footer = {
  wordmark: "Northstar",
  mission:
    "An AI-native growth agency and growth-product builder — AI operators, AI dashboards for optimizing ads, AI performance marketing, and agents that learn from every campaign.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "#how" },
        { label: "What we do", href: "#capabilities" },
        { label: "The loop", href: "#engine" },
        { label: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Contact", href: DEMO_URL },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Security", href: "#" },
      ],
    },
  ],
  socials: ["x", "linkedin", "github"],
  legal: "© 2026 Northstar Labs, Inc. All rights reserved.",
} as const;
