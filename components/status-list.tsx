import type { IntegrationStatus } from "@/types/integrations";

type StatusListProps = {
  statuses: IntegrationStatus[];
};

function getStatusTone(status: IntegrationStatus): string {
  if (status.state === "connected" || status.state === "configured") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }

  return "border-zinc-700 bg-zinc-900/70 text-zinc-300";
}

export function StatusList({ statuses }: StatusListProps) {
  return (
    <section
      aria-labelledby="integration-status-heading"
      className="w-full max-w-xl rounded-3xl border border-white/10 bg-black/35 p-6 shadow-2xl shadow-black/30 backdrop-blur"
    >
      <h2
        id="integration-status-heading"
        className="text-sm font-medium uppercase tracking-[0.32em] text-zinc-400"
      >
        Status
      </h2>

      <div className="mt-5 space-y-3">
        {statuses.map((status) => (
          <div
            key={status.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <span className="text-base font-medium text-zinc-100">
              {status.label}
            </span>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusTone(
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
