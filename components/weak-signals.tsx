import { EmptyState, IntelligenceSection } from "@/components/intelligence-section";
import type { WeakSignal } from "@/types/intelligence-product";

type WeakSignalsProps = {
  signals: WeakSignal[];
};

export function WeakSignals({ signals }: WeakSignalsProps) {
  return (
    <IntelligenceSection title="Weak Signals">
      {signals.length === 0 ? (
        <EmptyState message="No weak signals detected yet." />
      ) : (
        <div className="grid gap-4">
          {signals.map((signal) => (
            <article
              key={signal.id}
              className="border border-zinc-800 bg-zinc-950/60 p-4"
            >
              <h3 className="font-mono text-base text-zinc-100">
                {signal.name}
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-600">
                    Evidence
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    {signal.evidence}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-600">
                    Why it may matter
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    {signal.why_it_may_matter}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-600">
                    Needs confirmation
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    {signal.needs_confirmation}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </IntelligenceSection>
  );
}
