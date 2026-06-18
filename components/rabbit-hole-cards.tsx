import { EmptyState, IntelligenceSection } from "@/components/intelligence-section";
import type { RabbitHole } from "@/types/intelligence-product";

type RabbitHoleCardsProps = {
  rabbitHoles: RabbitHole[];
};

function formatScore(value: number | null): string {
  return value === null ? "Not measured" : String(value);
}

export function RabbitHoleCards({ rabbitHoles }: RabbitHoleCardsProps) {
  return (
    <IntelligenceSection title="Emerging Rabbit Holes">
      {rabbitHoles.length === 0 ? (
        <EmptyState message="No rabbit holes detected yet." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {rabbitHoles.map((rabbitHole) => (
            <article
              key={rabbitHole.id}
              className="border border-zinc-800 bg-zinc-950/60 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-mono text-lg text-zinc-100">
                    {rabbitHole.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-zinc-600">
                    {rabbitHole.category} / {rabbitHole.chain_relevance}
                  </p>
                </div>
                <span className="border border-zinc-700 px-2 py-1 font-mono text-xs text-zinc-300">
                  {rabbitHole.status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-300">
                {rabbitHole.core_thesis}
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-zinc-600">
                Why detected
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {rabbitHole.why_detected}
              </p>

              <div className="mt-4 grid gap-2 font-mono text-xs text-zinc-400 sm:grid-cols-4">
                <span>Evidence: {rabbitHole.evidence_count}</span>
                <span>Lead: {formatScore(rabbitHole.lead_time_score)}</span>
                <span>
                  Financialization:{" "}
                  {formatScore(rabbitHole.financialization_potential)}
                </span>
                <span>
                  Inevitability: {formatScore(rabbitHole.inevitability_score)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </IntelligenceSection>
  );
}
