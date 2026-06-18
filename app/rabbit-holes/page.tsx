import { RabbitHoleCards } from "@/components/rabbit-hole-cards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getIntelligenceDashboard } from "@/services/intelligence-product";

export const dynamic = "force-dynamic";

export default async function RabbitHolesPage() {
  const dashboardData = await getIntelligenceDashboard(
    createSupabaseServerClient(),
  );

  return (
    <>
      <header className="mb-8 border-b border-zinc-800 pb-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.32em] text-zinc-500">
          Research Desk
        </p>
        <h1 className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Rabbit Holes
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
          Early rabbit holes should surface recurring curiosity, belief, and
          builder motion before a market category is obvious.
        </p>
      </header>

      <RabbitHoleCards rabbitHoles={dashboardData.rabbit_holes} />
    </>
  );
}
