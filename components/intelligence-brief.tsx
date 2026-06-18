import { EMPTY_INTELLIGENCE_MESSAGE } from "@/services/intelligence-product";
import type { IntelligenceBrief } from "@/types/intelligence-product";
import { EmptyState, IntelligenceSection } from "@/components/intelligence-section";

type IntelligenceBriefProps = {
  brief: IntelligenceBrief | null;
};

const BRIEF_ROWS: Array<{
  key: keyof IntelligenceBrief;
  label: string;
}> = [
  { key: "changed_since_last_scan", label: "What changed since last scan?" },
  { key: "new_rabbit_holes", label: "What new rabbit holes appeared?" },
  { key: "forming_narratives", label: "What new narratives are forming?" },
  { key: "weak_signals", label: "What weak signals are worth watching?" },
  {
    key: "early_conviction_opportunities",
    label: "What opportunities show early conviction?",
  },
  {
    key: "risks_or_delusion_warnings",
    label: "What risks or delusion warnings appeared?",
  },
];

export function IntelligenceBriefPanel({ brief }: IntelligenceBriefProps) {
  const hasBrief =
    brief !== null && BRIEF_ROWS.some((row) => Boolean(brief[row.key]));

  return (
    <IntelligenceSection
      title="Today's Intelligence Brief"
      eyebrow="What is forming before the market notices?"
    >
      {!hasBrief ? (
        <EmptyState message={EMPTY_INTELLIGENCE_MESSAGE} />
      ) : (
        <div className="grid gap-3">
          {BRIEF_ROWS.map((row) => (
            <div key={row.key} className="border-b border-zinc-900 pb-3">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-600">
                {row.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {brief?.[row.key] ?? "No intelligence generated yet."}
              </p>
            </div>
          ))}
        </div>
      )}
    </IntelligenceSection>
  );
}
