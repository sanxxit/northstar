import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { CompoundingCurveViz } from "@/components/services/viz/CompoundingCurveViz";
import { getService } from "@/lib/services";

const slug = "full-funnel";
const s = getService(slug)!;

export const metadata: Metadata = {
  title: s.eyebrow,
  description: s.subhead,
};

export default function Page() {
  return <ServicePage slug={slug} viz={<CompoundingCurveViz />} />;
}
