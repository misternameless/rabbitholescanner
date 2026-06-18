import { OpportunitiesTable } from "@/components/opportunities-table";
import { ScanControls } from "@/components/scan-controls";
import { ScanStatistics } from "@/components/scan-statistics";
import { StatusList } from "@/components/status-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/services/dashboard";
import { getIntegrationStatuses } from "@/services/integration-status";

export const dynamic = "force-dynamic";

export default async function Home() {
  const statuses = getIntegrationStatuses();
  const dashboardData = await getDashboardData(createSupabaseServerClient());

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8 border-b border-zinc-800 pb-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.32em] text-zinc-500">
            Nameless Terminal
          </p>
          <h1 className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Nameless Intelligence
          </h1>
          <p className="mt-3 font-mono text-sm uppercase tracking-[0.24em] text-zinc-400">
            Signal Before Noise
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          <StatusList statuses={statuses} />
          <ScanStatistics statistics={dashboardData.scanStatistics} />
        </div>

        <div className="mt-5 grid gap-5">
          <OpportunitiesTable
            title="Latest Solana Opportunities"
            opportunities={dashboardData.solanaOpportunities}
          />
          <OpportunitiesTable
            title="Latest Base Opportunities"
            opportunities={dashboardData.baseOpportunities}
          />
          <ScanControls />
        </div>

      </div>
    </main>
  );
}
