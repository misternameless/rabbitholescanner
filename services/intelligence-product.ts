import type { IntelligenceDashboard } from "@/types/intelligence-product";

export const EMPTY_INTELLIGENCE_MESSAGE =
  "No intelligence generated yet. Run analysis after collecting source data.";

export async function getIntelligenceDashboard(): Promise<IntelligenceDashboard> {
  return {
    brief: null,
    rabbit_holes: [],
    digital_tribes: [],
    narrative_bubbles: [],
    opportunity_radar: [],
    weak_signals: [],
    related_assets: [],
  };
}
