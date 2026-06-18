import { EmptyState, IntelligenceSection } from "@/components/intelligence-section";
import type {
  IntelligenceStatus,
  OpportunityRadarItem,
} from "@/types/intelligence-product";

const RADAR_STAGES: IntelligenceStatus[] = [
  "Very Early",
  "Early",
  "Growing",
  "Crowded",
  "Exhausted",
];

type OpportunityRadarProps = {
  items: OpportunityRadarItem[];
};

export function OpportunityRadar({ items }: OpportunityRadarProps) {
  return (
    <IntelligenceSection
      title="Opportunity Radar"
      eyebrow="Where lead time may still exist"
    >
      {items.length === 0 ? (
        <EmptyState message="No opportunity radar generated yet." />
      ) : (
        <div className="grid gap-3 md:grid-cols-5">
          {RADAR_STAGES.map((stage) => (
            <div key={stage} className="border border-zinc-800 p-3">
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">
                {stage}
              </h3>
              <div className="mt-3 space-y-2">
                {items
                  .filter((item) => item.status === stage)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border border-zinc-900 bg-zinc-950 p-2 font-mono text-sm text-zinc-300"
                    >
                      {item.name}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </IntelligenceSection>
  );
}
