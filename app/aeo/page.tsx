import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { RecommendationViz } from "@/components/services/viz/RecommendationViz";
import { getService } from "@/lib/services";

const slug = "aeo";
const s = getService(slug)!;

export const metadata: Metadata = {
  title: s.eyebrow,
  description: s.subhead,
};

export default function Page() {
  return <ServicePage slug={slug} viz={<RecommendationViz />} />;
}
