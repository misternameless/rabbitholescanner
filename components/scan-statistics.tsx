import type { ScanStatistics } from "@/types/dashboard";

type ScanStatisticsProps = {
  statistics: ScanStatistics;
};

function formatDate(value: string | null): string {
  if (!value) {
    return "No scan results yet.";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function ScanStatistics({ statistics }: ScanStatisticsProps) {
  const rows = [
    ["Coins scanned", statistics.coinsScanned.toLocaleString()],
    ["Total coins", statistics.totalCoins.toLocaleString()],
    ["Last scan time", formatDate(statistics.lastScanTime)],
  ];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
      <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
        Scan Statistics
      </h2>

      <div className="mt-4 space-y-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 border-b border-zinc-900 py-2 last:border-b-0"
          >
            <span className="font-mono text-sm text-zinc-200">{label}</span>
            <span className="text-right font-mono text-sm text-zinc-400">
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
