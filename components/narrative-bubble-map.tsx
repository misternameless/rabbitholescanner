import { IntelligenceSection } from "@/components/intelligence-section";
import type { NarrativeBubble } from "@/types/intelligence-product";

type NarrativeBubbleMapProps = {
  bubbles: NarrativeBubble[];
};

function getBubbleColor(growth: number): string {
  if (growth >= 70) {
    return "bg-emerald-400/30";
  }

  if (growth >= 40) {
    return "bg-amber-400/30";
  }

  return "bg-zinc-500/20";
}

function getBubbleBorder(conviction: number): string {
  if (conviction >= 70) {
    return "border-emerald-300";
  }

  if (conviction >= 40) {
    return "border-amber-300";
  }

  return "border-zinc-600";
}

export function NarrativeBubbleMap({ bubbles }: NarrativeBubbleMapProps) {
  return (
    <IntelligenceSection
      title="Narrative Bubble Map"
      eyebrow="Narratives, tribes, rabbit holes, and clusters"
    >
      <div className="relative min-h-96 overflow-hidden border border-zinc-800 bg-[radial-gradient(circle_at_center,rgba(39,39,42,0.55),transparent_1px)] bg-[length:28px_28px]">
        <div className="absolute inset-x-0 top-1/2 border-t border-zinc-900" />
        <div className="absolute inset-y-0 left-1/2 border-l border-zinc-900" />
        <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-700">
          Adjacent narratives
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-700">
          Shared evidence
        </div>

        {bubbles.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="relative flex h-64 w-64 items-center justify-center">
              <div className="absolute h-full w-full rounded-full border border-dashed border-cyan-400/20" />
              <div className="absolute h-44 w-44 rounded-full border border-dashed border-fuchsia-400/20" />
              <div className="absolute h-24 w-24 rounded-full border border-dashed border-zinc-600/40" />
              <div className="absolute left-3 top-12 h-10 w-10 rounded-full border border-zinc-700 bg-zinc-950/80" />
              <div className="absolute bottom-8 right-6 h-14 w-14 rounded-full border border-zinc-700 bg-zinc-950/80" />
              <div className="absolute right-12 top-5 h-8 w-8 rounded-full border border-zinc-700 bg-zinc-950/80" />
              <div className="relative max-w-56 border border-dashed border-zinc-700 bg-black/80 p-4 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
                  Map awaiting analysis
                </p>
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  No narrative intelligence generated yet.
                </p>
              </div>
            </div>
          </div>
        ) : (
          bubbles.map((bubble) => {
            const size = Math.max(48, Math.min(160, bubble.attention));

            return (
              <div
                key={bubble.id}
                className={`absolute flex items-center justify-center rounded-full border text-center font-mono text-xs text-zinc-100 ${getBubbleColor(
                  bubble.growth,
                )} ${getBubbleBorder(bubble.conviction)}`}
                style={{
                  width: size,
                  height: size,
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {bubble.label}
              </div>
            );
          })
        )}
      </div>
    </IntelligenceSection>
  );
}
