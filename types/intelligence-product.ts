export type IntelligenceStatus =
  | "Very Early"
  | "Early"
  | "Growing"
  | "Crowded"
  | "Exhausted";

export type ChainRelevance = "Solana" | "Base" | "Both" | "Unknown";

export type IntelligenceBrief = {
  changed_since_last_scan: string | null;
  new_rabbit_holes: string | null;
  forming_narratives: string | null;
  weak_signals: string | null;
  early_conviction_opportunities: string | null;
  risks_or_delusion_warnings: string | null;
};

export type RabbitHole = {
  id: string;
  name: string;
  category: string;
  chain_relevance: ChainRelevance;
  core_thesis: string;
  why_detected: string;
  evidence_count: number;
  lead_time_score: number | null;
  financialization_potential: number | null;
  inevitability_score: number | null;
  status: IntelligenceStatus;
};

export type DigitalTribe = {
  id: string;
  name: string;
  forming_on: string[];
  core_belief: string;
  top_accounts: string[];
  top_channels: string[];
  related_repositories: string[];
  related_assets: string[];
  conviction_level: string | null;
};

export type NarrativeBubble = {
  id: string;
  label: string;
  kind: "narrative" | "tribe" | "rabbit_hole" | "opportunity_cluster";
  attention: number;
  growth: number;
  conviction: number;
  x: number;
  y: number;
};

export type OpportunityRadarItem = {
  id: string;
  name: string;
  status: IntelligenceStatus;
};

export type WeakSignal = {
  id: string;
  name: string;
  evidence: string;
  why_it_may_matter: string;
  needs_confirmation: string;
};

export type RelatedAsset = {
  id: string;
  name: string;
  symbol: string | null;
  chain: string;
  attached_to: string;
};

export type IntelligenceDashboard = {
  brief: IntelligenceBrief | null;
  rabbit_holes: RabbitHole[];
  digital_tribes: DigitalTribe[];
  narrative_bubbles: NarrativeBubble[];
  opportunity_radar: OpportunityRadarItem[];
  weak_signals: WeakSignal[];
  related_assets: RelatedAsset[];
};
