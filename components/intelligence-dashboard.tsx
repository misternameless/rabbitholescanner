import { IntelligenceCommandCenter } from "@/components/intelligence-command-center";
import { IntelligenceBriefPanel } from "@/components/intelligence-brief";
import { NarrativeBubbleMap } from "@/components/narrative-bubble-map";
import { OpportunityRadar } from "@/components/opportunity-radar";
import { RabbitHoleCards } from "@/components/rabbit-hole-cards";
import { RelatedAssets } from "@/components/related-assets";
import { TribeCards } from "@/components/tribe-cards";
import { WeakSignals } from "@/components/weak-signals";
import type { IntelligenceDashboard as IntelligenceDashboardData } from "@/types/intelligence-product";

type IntelligenceDashboardProps = {
  data: IntelligenceDashboardData;
};

export function IntelligenceDashboard({ data }: IntelligenceDashboardProps) {
  return (
    <div className="space-y-5">
      <IntelligenceCommandCenter
        readiness={data.readiness}
        sources={data.source_inventory}
      />
      <IntelligenceBriefPanel brief={data.brief} />
      <RabbitHoleCards rabbitHoles={data.rabbit_holes} />
      <TribeCards tribes={data.digital_tribes} />
      <NarrativeBubbleMap bubbles={data.narrative_bubbles} />
      <OpportunityRadar items={data.opportunity_radar} />
      <WeakSignals signals={data.weak_signals} />
      <RelatedAssets assets={data.related_assets} />
    </div>
  );
}
