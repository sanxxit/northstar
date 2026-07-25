import { Hero } from "@/components/sections/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { AgenticFlow } from "@/components/sections/AgenticFlow";
import { Capabilities } from "@/components/sections/Capabilities";
import { EngineDiagram } from "@/components/sections/EngineDiagram";
import { AgentsSmarter } from "@/components/sections/AgentsSmarter";
import { Compounding } from "@/components/sections/Compounding";
import { Results } from "@/components/sections/Results";
import { Pricing } from "@/components/sections/Pricing";
import { CTASection } from "@/components/sections/CTA";

export default function Home() {
  return (
    <main>
      {/* Hero → Positioning → Agentic flow → What we do → The loop →
          Gets smarter → Compounding → Proof → Pricing → CTA */}
      <Hero />
      <Positioning />
      <AgenticFlow />
      <Capabilities />
      <EngineDiagram />
      <AgentsSmarter />
      <Compounding />
      <Results />
      <Pricing />
      <CTASection />
    </main>
  );
}
