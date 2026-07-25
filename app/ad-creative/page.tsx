import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { CreativeMatrixViz } from "@/components/services/viz/CreativeMatrixViz";
import { getService } from "@/lib/services";

const slug = "ad-creative";
const s = getService(slug)!;

export const metadata: Metadata = {
  title: s.eyebrow,
  description: s.subhead,
};

export default function Page() {
  return <ServicePage slug={slug} viz={<CreativeMatrixViz />} />;
}
