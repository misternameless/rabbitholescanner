import { OpportunityRadar } from "@/components/opportunity-radar";
import { RelatedAssets } from "@/components/related-assets";
import { WeakSignals } from "@/components/weak-signals";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getIntelligenceDashboard } from "@/services/intelligence-product";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const dashboardData = await getIntelligenceDashboard(
    createSupabaseServerClient(),
  );

  return (
    <>
      <header className="mb-8 border-b border-zinc-800 pb-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.32em] text-zinc-500">
          Frontier Map
        </p>
        <h1 className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Opportunities
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
          Opportunity views should prioritize lead time, weak signals, and
          conviction evidence. Assets remain secondary.
        </p>
      </header>

      <div className="space-y-5">
        <OpportunityRadar items={dashboardData.opportunity_radar} />
        <WeakSignals signals={dashboardData.weak_signals} />
        <RelatedAssets assets={dashboardData.related_assets} />
      </div>
    </>
  );
}
