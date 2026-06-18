import { ScanControls } from "@/components/scan-controls";
import { StatusList } from "@/components/status-list";
import { IntelligenceSection } from "@/components/intelligence-section";
import { getIntegrationStatuses } from "@/services/integration-status";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const statuses = getIntegrationStatuses();

  return (
    <>
      <header className="mb-8 border-b border-zinc-800 pb-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.32em] text-zinc-500">
          Source Operations
        </p>
        <h1 className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Settings
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
          Configure and run source collection. Dexscreener remains a supporting
          asset source, not the product center.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <StatusList statuses={statuses} />
        <IntelligenceSection title="Analysis Status">
          <p className="font-mono text-sm leading-6 text-zinc-500">
            No intelligence analysis pipeline has been generated yet.
          </p>
        </IntelligenceSection>
      </div>

      <div className="mt-5">
        <ScanControls />
      </div>
    </>
  );
}
