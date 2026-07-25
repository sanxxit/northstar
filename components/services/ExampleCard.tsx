import { FlaskConical } from "lucide-react";

/** An explicitly illustrative scenario — never framed as a real client quote. */
export function ExampleCard({ text }: { text: string }) {
  return (
    <div className="card relative overflow-hidden rounded-2xl p-6 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
      />
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-accent-bright">
          <FlaskConical className="h-3 w-3" aria-hidden />
          Illustrative scenario
        </span>
        <span className="text-xs text-faint">
          directional numbers · not a named client
        </span>
      </div>
      <p className="text-lg leading-relaxed text-muted">{text}</p>
    </div>
  );
}
