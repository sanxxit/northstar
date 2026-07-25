/**
 * NORTHSTAR — content for the 8 "What we do" service detail pages.
 * Same anatomy on every page (cohesive), different story on each (never a template).
 * American English. Examples are ILLUSTRATIVE scenarios with directional numbers,
 * NOT real named clients — keep them framed that way on the live site.
 */

export type ServiceContent = {
  slug: string;
  eyebrow: string;
  h1: string;
  subhead: string;
  story: { tension: string; shift: string; outcome: string };
  whatYouGet: string[];
  flow: { steps: string[]; loop: boolean };
  proof: { heading: string; sub: string };
  example: string;
  /** which side the data-viz sits on desktop — alternated for gentle variation */
  vizSide: "left" | "right";
};

export const services: ServiceContent[] = [
  {
    slug: "performance-marketing",
    eyebrow: "AI Performance Marketing",
    h1: "Media buying that never sleeps.",
    subhead:
      "We test more angles, cut losers faster, and move budget to winners 24/7 — so every dollar works where it performs best.",
    story: {
      tension:
        "Performance marketing is a race: find the hook, angle, and audience that convert before your competitors do. Done by hand — brief, launch, read the dashboard, reallocate — that race is slow. And slow loses.",
      shift:
        "Northstar runs the loop continuously. Our agents launch dozens of combinations, read live conversion data, and shift spend the moment one pulls ahead — no waiting for the Monday report.",
      outcome:
        "You spend the same budget and get more from it: lower CAC, higher ROAS, and a testing velocity no human team can match.",
    },
    whatYouGet: [
      "24/7 budget reallocation across Meta, Google, TikTok, LinkedIn, Snapchat & Reddit",
      "Auto-kill / auto-scale rules tied to your real CAC and ROAS targets",
      "Continuous angle, audience, and creative testing",
      "Brand-safe, policy-compliant launches",
      "Weekly plain-English readouts — no dashboard archaeology",
    ],
    flow: {
      steps: [
        "Research angles",
        "Generate variants",
        "Launch multichannel",
        "Measure CAC / ROAS",
        "Reallocate budget",
      ],
      loop: true,
    },
    proof: {
      heading: "Watch the machine move the money.",
      sub: "Budget consolidates into the winning angles in real time — losers get cut, winners get scaled, blended ROAS climbs.",
    },
    example:
      "A US D2C supplement brand spending ~$80k/mo across Meta + Google. Over 6 weeks, budget consolidated into 3 winning angles: blended ROAS moved ~2.1× → ~3.4× and CAC fell ~28% — same spend, more output.",
    vizSide: "right",
  },
  {
    slug: "ad-creative",
    eyebrow: "AI Video & Static Ads",
    h1: "Creative at the speed of thought.",
    subhead:
      "Hundreds of on-brand video and static variants from a single brief — each tuned to a hook, an audience, and a platform.",
    story: {
      tension:
        "The math of paid social is brutal: you need to test ~50 ideas to find 3 winners, but a human team can ship 5 before burning out. That gap is where growth stalls.",
      shift:
        "Give Northstar one brief and it produces hundreds of variants — every ratio, every format, every angle — all checked against your brand guidelines before a single one goes live.",
      outcome:
        "So you stop rationing creative. You test broadly, find winners fast, and refresh them the moment fatigue sets in.",
    },
    whatYouGet: [
      "Static + video in every ratio (9:16, 1:1, 16:9)",
      "On-brand, on-guideline — tone, color, and logo lockup checked automatically",
      "Hook × audience × format matrices, not one-size variants",
      "Fresh variants auto-generated when creative fatigues",
      "Winners handed straight to your buyer (or our agents)",
    ],
    flow: {
      steps: [
        "One brief",
        "Generate variants",
        "Brand check",
        "Ship to channels",
        "Measure",
        "Refresh on fatigue",
      ],
      loop: true,
    },
    proof: {
      heading: "See which combinations actually win.",
      sub: "Hooks across the rows, audiences across the columns — the winning cells light up, so 'we make a lot of ads' becomes 'we find the ones that work.'",
    },
    example:
      "A UK skincare brand needed a Q4 push. From one brief: ~480 variants generated, 60 launched; the top 3 hooks drove ~2.6× the click-through of the prior best ad.",
    vizSide: "left",
  },
  {
    slug: "aeo",
    eyebrow: "AEO — SEO for LLMs",
    h1: "Get recommended by AI, not just ranked by Google.",
    subhead:
      "Your buyers now ask ChatGPT, Claude, and Perplexity what to buy. We make sure the answer is you.",
    story: {
      tension:
        "Discovery is moving from ten blue links to a single AI recommendation. On Google, people type “best CRM.” In ChatGPT, they describe their exact situation and get one or two names back. If you're not one of them, you're invisible to the fastest-growing slice of buyers.",
      shift:
        "AEO — Answer Engine Optimization — is SEO built for language models. We find the high-intent questions your buyers actually ask AI, publish content structured for machine citation, and route AI crawlers to clean, fast, structured versions of your pages.",
      outcome:
        "The result: you show up — cited and recommended — inside the AI answers where decisions now start, while still ranking on Google.",
    },
    whatYouGet: [
      "Question mining: the real prompts buyers use in your category",
      "Content engineered to be cited (structured for LLM consumption)",
      "Clean, fast, structured page variants for AI crawlers",
      "Citation tracking across ChatGPT, Claude, Perplexity & Gemini",
      "Runs alongside your existing SEO — not instead of it",
    ],
    flow: {
      steps: [
        "Mine buyer questions",
        "AI-optimized content",
        "Clean structured pages",
        "Route AI crawlers",
        "Track citations",
      ],
      loop: true,
    },
    proof: {
      heading: "Watch the AIs start recommending you.",
      sub: "Citation rate across ChatGPT, Claude, Perplexity, and Gemini, climbing week over week — the panel looks like the product itself.",
    },
    example:
      "A B2B SaaS in payroll was cited in ~4% of relevant AI answers at the start. Over 8 weeks of AEO, citations rose to ~35% across ChatGPT and Perplexity for its core use-case questions.",
    vizSide: "right",
  },
  {
    slug: "dashboards",
    eyebrow: "Full-Funnel Dashboards",
    h1: 'One number that answers “is everything okay?”',
    subhead:
      "Meta, Google, LinkedIn, and TikTok — plus your CRM — unified into one live view, from first impression to closed revenue.",
    story: {
      tension:
        "Your data lives in six ad platforms, an analytics tool, and a CRM that all disagree. By the time someone stitches a report together, the week is gone.",
      shift:
        "Northstar unifies every channel into one dashboard that leads with the metric that matters — blended ROAS, pipeline, CAC — and lets you drill down only when you need to. Alerts come to you; you don't go hunting.",
      outcome:
        "Everyone from the founder to the buyer sees the same truth in real time, and spends their hours acting on it instead of assembling it.",
    },
    whatYouGet: [
      "Unified spend, clicks, leads & revenue across all channels",
      "Blended, cross-channel metrics — not per-platform silos",
      "The one “north-star” number first, details on demand",
      "Real-time alerts on spikes, drops & pacing",
      "The same dashboard our operators use — no black box",
    ],
    flow: {
      steps: [
        "Connect channels + CRM",
        "Unify + de-dupe",
        "Blended metrics",
        "Alerts",
        "Action",
      ],
      loop: false,
    },
    proof: {
      heading: "Lead with one number. Drill down on demand.",
      sub: "The Mercury/Ramp pattern: surface “is everything okay?” first — one hero metric and a sparkline — details only when you want them.",
    },
    example:
      "A mid-size US e-commerce company ran 5 ad accounts and 3 spreadsheets. After unifying, weekly reporting dropped from ~6 hours to near-zero — and an alert caught a TikTok pacing issue quietly burning ~$1.5k/week.",
    vizSide: "left",
  },
  {
    slug: "lead-generation",
    eyebrow: "Lead Generation",
    h1: "More pipeline, not just more leads.",
    subhead:
      "We optimize for the leads that actually close — qualified, scored, and routed — with a guaranteed lift in performance.",
    story: {
      tension:
        "Anyone can buy you form-fills. But a pile of unqualified leads just moves the bottleneck to your sales team and burns budget on people who'll never buy.",
      shift:
        "Northstar optimizes the whole path: targeting the right ICP, capturing across channels, enriching and scoring every lead, and routing only the ready ones — then tuning spend toward the sources that produce real pipeline.",
      outcome:
        "The result: a lower cost per qualified lead, a cleaner handoff to sales, and a system that gets better at finding your best customers every week.",
    },
    whatYouGet: [
      "ICP-first targeting across paid, social & outbound",
      "Enrichment + scoring so sales only sees the ready ones",
      "Multi-channel capture with message-matched landing pages",
      "Optimization toward pipeline and revenue — not vanity form-fills",
      "A guaranteed lift in qualified-lead performance",
    ],
    flow: {
      steps: [
        "Define ICP",
        "Multi-channel capture",
        "Enrich + score",
        "Route ready leads to sales",
        "Optimize toward pipeline",
      ],
      loop: true,
    },
    proof: {
      heading: "From “leads” to pipeline.",
      sub: "Leads → MQL → SQL → Won, each step showing its conversion rate — so quality, not just volume, is the story.",
    },
    example:
      "A UK B2B SaaS was paying ~£90 per lead but closing 2%. After optimizing for qualified pipeline, cost per qualified lead dropped while SQL volume roughly doubled on the same budget.",
    vizSide: "right",
  },
  {
    slug: "market-research",
    eyebrow: "Market Research",
    h1: "Read the market before you spend a dollar.",
    subhead:
      "Live competitor teardowns, trend detection, and positioning maps — so every campaign starts with an edge, not a guess.",
    story: {
      tension:
        "Most campaigns launch on a hunch and a mood board. Meanwhile your competitors' winning angles are sitting in plain sight — you just don't have time to analyze thousands of ads.",
      shift:
        "Northstar ingests the entire ad landscape in your category — winning creatives, competitor spend patterns, emerging angles — and turns it into a clear read: what's working, what's saturated, and where the opening is.",
      outcome:
        "So you brief from evidence. Every campaign starts with the market's best ideas as your baseline and an angle competitors haven't crowded yet.",
    },
    whatYouGet: [
      "Live competitor ad teardowns and spend estimates",
      "Trend and winning-angle detection in real time",
      "Audience and positioning maps",
      "Category-entry and new-region reads (US ⇄ UK / EU / APAC)",
      "Findings that flow straight into your creative brief",
    ],
    flow: {
      steps: [
        "Ingest ad landscape",
        "Competitor teardown",
        "Trend + angle detection",
        "Positioning map",
        "Creative brief",
      ],
      loop: false,
    },
    proof: {
      heading: "See the opening on the map.",
      sub: "Competitors plotted by spend and engagement, sized by share of voice — with the empty, high-potential space your next campaign should own.",
    },
    example:
      "A US personal-care brand expanding into the UK found the category saturated on “clean ingredients” but wide open on “speed & convenience.” Leading with the convenience angle became their top-performing launch hook.",
    vizSide: "left",
  },
  {
    slug: "agentic",
    eyebrow: "Agentic Marketing",
    h1: "Agents that operate your stack — not another tool to log into.",
    subhead:
      "You already have the tools and the ideas. Our agents do the clicking: pulling audiences, generating creative, and deploying straight into HubSpot, Marketo, and Salesforce.",
    story: {
      tension:
        "Your marketing stack already has hundreds of tools. The problem was never capability — it's throughput. There are always more campaigns to run than your team has hours to click through.",
      shift:
        "Northstar's agents work inside the tools you already use. Give them a brief and they pull the audience, generate on-brand assets, run the brand check, and deploy across your stack — no decks, no handoffs, no new dashboard to adopt.",
      outcome:
        "So the boring, high-volume growth work gets done — reliably, at machine speed — while your team focuses on strategy and the ideas only humans have.",
    },
    whatYouGet: [
      "Agents that operate Responsys, Marketo, Salesforce Marketing Cloud, HubSpot & LinkedIn",
      "Brief → audience → creative → brand check → deploy, end-to-end",
      "Human-in-the-loop approval before anything ships",
      "No new platform to adopt — it runs where you already work",
      "Throughput that scales without adding headcount",
    ],
    flow: {
      steps: [
        "Brief",
        "Pull audience + data",
        "Generate creative",
        "Brand check",
        "Deploy into your stack",
        "Monitor + report",
      ],
      loop: false,
    },
    proof: {
      heading: "Volume without headcount.",
      sub: "The one thing agentic actually unlocks: the same team shipping many more campaigns, and brief-to-live measured in days, not weeks.",
    },
    example:
      "A 4-person growth team shipped ~6 campaigns a month, bottlenecked on production and deployment. With agents handling build-and-deploy inside their existing stack, they reached ~40 a month at the same headcount.",
    vizSide: "right",
  },
  {
    slug: "full-funnel",
    eyebrow: "Full-Funnel Marketing",
    h1: "The whole funnel, run as one compounding system.",
    subhead:
      "Awareness to conversion to retention — one team, one loop, every channel — so growth stops leaking between the gaps.",
    story: {
      tension:
        "Point solutions leave seams. Your ads team, your SEO, your email, and your landing pages each optimize their own slice — and growth quietly leaks in the gaps between them.",
      shift:
        "Northstar runs the entire funnel as a single loop: research → creative → landing pages → launch → optimization → learning that feeds the next cycle. Every stage talks to the others, and every campaign makes the next one smarter.",
      outcome:
        "No handoffs, no gaps, no starting from zero. Your top of funnel feeds your bottom, your learnings compound, and your advantage grows every week.",
    },
    whatYouGet: [
      "TOFU → MOFU → BOFU → retention, run as one system",
      "Research, creative, landing pages, launch & optimization in one loop",
      "A shared brand memory so every campaign compounds",
      "Every major channel — paid, social, SEO/AEO, email",
      "One team accountable for the whole number, not a slice",
    ],
    flow: {
      steps: ["Research", "Create", "Launch", "Optimize", "Learn"],
      loop: true,
    },
    proof: {
      heading: "The shape of the curve is the pitch.",
      sub: "Because each cycle inherits the last one's learnings, performance accelerates instead of plateauing — a line that curves up, not a straight one.",
    },
    example:
      "A DTC brand running disconnected agencies for ads and SEO consolidated into one funnel. Within a quarter, blended ROAS rose and cost per acquisition fell as TOFU learnings fed BOFU creative and retention email.",
    vizSide: "left",
  },
];

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug: string): ServiceContent | undefined {
  return services.find((s) => s.slug === slug);
}
