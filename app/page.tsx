import { IntelligenceDashboard } from "@/components/intelligence-dashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getIntelligenceDashboard } from "@/services/intelligence-product";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dashboardData = await getIntelligenceDashboard(
    createSupabaseServerClient(),
  );

  return (
    <>
      <header className="mb-8 overflow-hidden rounded-[2rem] border border-zinc-800 bg-black/50 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.32em] text-cyan-300/80">
              Intelligence Briefing
            </p>
            <h1 className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Nameless Intelligence
            </h1>
            <p className="mt-3 font-mono text-sm uppercase tracking-[0.24em] text-zinc-400">
              Signal Before Noise
            </p>
          </div>
          <div className="max-w-md border-l border-zinc-800 pl-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
              Operating mandate
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Identify rabbit holes, tribes, narratives, builders, and weak
              signals before assets make them obvious.
            </p>
          </div>
        </div>
      </header>

      <IntelligenceDashboard data={dashboardData} />
    </>
  );
}
