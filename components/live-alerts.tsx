import type { IntelligenceAlert } from "@/types/intelligence-product";

type LiveAlertsProps = {
  alerts: IntelligenceAlert[];
};

function getSeverityTone(severity: IntelligenceAlert["severity"]): string {
  if (severity === "warning") {
    return "border-amber-400/40 bg-amber-400/10 text-amber-100";
  }

  if (severity === "watch") {
    return "border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-100";
  }

  return "border-cyan-400/40 bg-cyan-400/10 text-cyan-100";
}

export function LiveAlerts({ alerts }: LiveAlertsProps) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-zinc-800 bg-black/50">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-900 px-5 py-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
            Live Alerts
          </p>
          <h2 className="mt-1 font-mono text-lg text-zinc-100">
            Signal Notifications
          </h2>
        </div>
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-300" />
        </span>
      </div>

      {alerts.length === 0 ? (
        <p className="p-5 font-mono text-sm text-zinc-500">
          No live alerts generated yet.
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto p-4">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className={`min-w-80 border p-4 ${getSeverityTone(alert.severity)}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mono text-sm uppercase tracking-[0.14em]">
                  {alert.title}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-70">
                  {alert.severity}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 opacity-85">{alert.detail}</p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] opacity-60">
                {alert.source}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
