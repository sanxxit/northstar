import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { OneNumberViz } from "@/components/services/viz/OneNumberViz";
import { getService } from "@/lib/services";

const slug = "dashboards";
const s = getService(slug)!;

export const metadata: Metadata = {
  title: s.eyebrow,
  description: s.subhead,
};

export default function Page() {
  return <ServicePage slug={slug} viz={<OneNumberViz />} />;
}
