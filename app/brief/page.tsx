import { LiveIntelligenceDashboard } from "@/components/live-intelligence-dashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getIntelligenceDashboard } from "@/services/intelligence-product";

export const dynamic = "force-dynamic";

export default async function BriefPage() {
  const dashboardData = await getIntelligenceDashboard(
    createSupabaseServerClient(),
  );

  return (
    <>
      <header className="mb-8 border-b border-zinc-800 pb-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.32em] text-zinc-500">
          Brief
        </p>
        <h1 className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Nameless Intelligence
        </h1>
        <p className="mt-3 font-mono text-sm uppercase tracking-[0.24em] text-zinc-400">
          Signal Before Noise
        </p>
      </header>

      <LiveIntelligenceDashboard initialData={dashboardData} />
    </>
  );
}
