import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { BubbleMapViz } from "@/components/services/viz/BubbleMapViz";
import { getService } from "@/lib/services";

const slug = "market-research";
const s = getService(slug)!;

export const metadata: Metadata = {
  title: s.eyebrow,
  description: s.subhead,
};

export default function Page() {
  return <ServicePage slug={slug} viz={<BubbleMapViz />} />;
}
