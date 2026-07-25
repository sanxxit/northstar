import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { PipelineFunnelViz } from "@/components/services/viz/PipelineFunnelViz";
import { getService } from "@/lib/services";

const slug = "lead-generation";
const s = getService(slug)!;

export const metadata: Metadata = {
  title: s.eyebrow,
  description: s.subhead,
};

export default function Page() {
  return <ServicePage slug={slug} viz={<PipelineFunnelViz />} />;
}
