import { TribeCards } from "@/components/tribe-cards";
import { getIntelligenceDashboard } from "@/services/intelligence-product";

export const dynamic = "force-dynamic";

export default async function TribesPage() {
  const dashboardData = await getIntelligenceDashboard();

  return (
    <>
      <header className="mb-8 border-b border-zinc-800 pb-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.32em] text-zinc-500">
          Research Desk
        </p>
        <h1 className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Digital Tribes
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
          Tribes form around shared beliefs, repeated language, accounts,
          channels, repositories, and assets as supporting evidence.
        </p>
      </header>

      <TribeCards tribes={dashboardData.digital_tribes} />
    </>
  );
}
