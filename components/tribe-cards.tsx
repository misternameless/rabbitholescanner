import { EmptyState, IntelligenceSection } from "@/components/intelligence-section";
import type { DigitalTribe } from "@/types/intelligence-product";

type TribeCardsProps = {
  tribes: DigitalTribe[];
};

function ListValue({
  label,
  values,
}: {
  label: string;
  values: string[];
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-600">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-zinc-400">
        {values.length > 0 ? values.join(", ") : "Not available yet."}
      </p>
    </div>
  );
}

export function TribeCards({ tribes }: TribeCardsProps) {
  return (
    <IntelligenceSection title="Digital Tribes">
      {tribes.length === 0 ? (
        <EmptyState message="No digital tribes detected yet." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {tribes.map((tribe) => (
            <article
              key={tribe.id}
              className="border border-zinc-800 bg-zinc-950/60 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-mono text-lg text-zinc-100">
                    {tribe.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-zinc-600">
                    {tribe.forming_on.join(" / ") || "Source unknown"}
                  </p>
                </div>
                <span className="border border-zinc-700 px-2 py-1 font-mono text-xs text-zinc-300">
                  {tribe.conviction_level ?? "Unmeasured"}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-300">
                {tribe.core_belief}
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <ListValue label="Top accounts" values={tribe.top_accounts} />
                <ListValue label="Top channels" values={tribe.top_channels} />
                <ListValue
                  label="Related repositories"
                  values={tribe.related_repositories}
                />
                <ListValue
                  label="Related assets"
                  values={tribe.related_assets}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </IntelligenceSection>
  );
}
