import type {
  IntelligenceReadiness,
  SourceInventoryItem,
} from "@/types/intelligence-product";

type IntelligenceCommandCenterProps = {
  readiness: IntelligenceReadiness;
  sources: SourceInventoryItem[];
};

function formatDate(value: string | null): string {
  if (!value) {
    return "No scan";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function getStatusTone(status: SourceInventoryItem["status"]): string {
  if (status === "Collecting") {
    return "border-emerald-400/40 text-emerald-200";
  }

  if (status === "Supporting Source") {
    return "border-cyan-400/40 text-cyan-200";
  }

  if (status === "Blocked") {
    return "border-amber-400/40 text-amber-200";
  }

  return "border-zinc-700 text-zinc-500";
}

export function IntelligenceCommandCenter({
  readiness,
  sources,
}: IntelligenceCommandCenterProps) {
  const readinessCards = [
    ["Source Documents", readiness.source_documents],
    ["Generated Briefs", readiness.generated_briefs],
    ["Rabbit Holes", readiness.detected_rabbit_holes],
    ["Digital Tribes", readiness.detected_tribes],
    ["Narratives", readiness.detected_narratives],
    ["Weak Signals", readiness.weak_signals],
  ];

  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-zinc-950/80 p-6 shadow-2xl shadow-cyan-950/20">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <p className="relative font-mono text-xs uppercase tracking-[0.32em] text-cyan-300/80">
          Core Product Question
        </p>
        <h2 className="relative mt-4 max-w-3xl font-mono text-3xl font-semibold leading-tight text-white md:text-5xl">
          What is forming before the market notices?
        </h2>
        <p className="relative mt-5 max-w-2xl text-sm leading-7 text-zinc-400">
          Nameless Intelligence should rank source evidence by tribe formation,
          narrative emergence, builder motion, and weak-signal conviction. Raw
          assets are supporting evidence only.
        </p>

        <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
          {readinessCards.map(([label, value]) => (
            <div
              key={label}
              className="border border-white/10 bg-white/[0.03] p-4"
            >
              <p className="font-mono text-2xl text-zinc-100">{value}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-zinc-800 bg-black/50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
              Source Priority
            </p>
            <h2 className="mt-2 font-mono text-lg text-zinc-100">
              Evidence Intake
            </h2>
          </div>
          <span className="rounded-full border border-zinc-700 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            Live inventory
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {sources.map((source) => (
            <div
              key={source.source}
              className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 border border-zinc-900 bg-zinc-950/60 p-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 font-mono text-xs text-zinc-500">
                {source.priority}
              </span>
              <div>
                <p className="font-mono text-sm text-zinc-200">
                  {source.source}
                </p>
                <p className="mt-1 font-mono text-[11px] text-zinc-600">
                  {source.evidence_count.toLocaleString()} evidence items /{" "}
                  {formatDate(source.last_scan_at)}
                </p>
              </div>
              <span
                className={`whitespace-nowrap rounded-full border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${getStatusTone(
                  source.status,
                )}`}
              >
                {source.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
