import type { IntegrationStatus } from "@/types/integrations";

type StatusListProps = {
  statuses: IntegrationStatus[];
};

function getStatusTone(status: IntegrationStatus): string {
  if (
    status.state === "connected" ||
    status.state === "configured" ||
    status.state === "available"
  ) {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }

  return "border-zinc-700 bg-zinc-900/70 text-zinc-300";
}

export function StatusList({ statuses }: StatusListProps) {
  return (
    <section
      aria-labelledby="integration-status-heading"
      className="rounded-2xl border border-zinc-800 bg-black/40 p-5"
    >
      <h2
        id="integration-status-heading"
        className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500"
      >
        System Status
      </h2>

      <div className="mt-4 space-y-2">
        {statuses.map((status) => (
          <div
            key={status.id}
            className="flex items-center justify-between gap-4 border-b border-zinc-900 py-2 last:border-b-0"
          >
            <span className="font-mono text-sm text-zinc-200">
              {status.label}
            </span>
            <span
              className={`rounded-full border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] ${getStatusTone(
                status,
              )}`}
            >
              {status.displayValue}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
