"use client";

import { ArrowRight, Play } from "lucide-react";
import { DEMO_URL } from "@/lib/content";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

/** Book a demo (opens the booking form in a new tab) + See it run (scrolls to the on-page proof). */
export function ServiceCTA({ center = false }: { center?: boolean }) {
  return (
    <div className={cn("flex flex-wrap gap-4", center && "justify-center")}>
      <MagneticButton
        href={DEMO_URL}
        ariaLabel="Book a demo (opens booking form in a new tab)"
      >
        Book a demo
        <ArrowRight className="h-4 w-4" aria-hidden />
      </MagneticButton>
      <MagneticButton variant="outline" href="#proof">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-accent/15 text-accent-bright ring-1 ring-accent/40">
          <Play className="h-2.5 w-2.5 translate-x-[0.5px]" aria-hidden />
        </span>
        See it run
      </MagneticButton>
    </div>
  );
}
