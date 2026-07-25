import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { ThroughputViz } from "@/components/services/viz/ThroughputViz";
import { getService } from "@/lib/services";

const slug = "agentic";
const s = getService(slug)!;

export const metadata: Metadata = {
  title: s.eyebrow,
  description: s.subhead,
};

export default function Page() {
  return <ServicePage slug={slug} viz={<ThroughputViz />} />;
}
