import { NarrativeBubbleMap } from "@/components/narrative-bubble-map";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getIntelligenceDashboard } from "@/services/intelligence-product";

export const dynamic = "force-dynamic";

export default async function NarrativesPage() {
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
          Narratives
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
          Narrative maps should show relationships between tribes, rabbit holes,
          and opportunity clusters, not token holder activity.
        </p>
      </header>

      <NarrativeBubbleMap bubbles={dashboardData.narrative_bubbles} />
    </>
  );
}
