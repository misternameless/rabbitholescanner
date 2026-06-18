import { EmptyState, IntelligenceSection } from "@/components/intelligence-section";
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

        {bubbles.length === 0 ? (
          <div className="absolute inset-6 flex items-center justify-center">
            <EmptyState message="No narrative map generated yet." />
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
