import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { ReallocationViz } from "@/components/services/viz/ReallocationViz";
import { getService } from "@/lib/services";

const slug = "performance-marketing";
const s = getService(slug)!;

export const metadata: Metadata = {
  title: s.eyebrow,
  description: s.subhead,
};

export default function Page() {
  return <ServicePage slug={slug} viz={<ReallocationViz />} />;
}
