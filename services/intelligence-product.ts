import type { SupabaseClient } from "@supabase/supabase-js";
import { getEmergingClusters } from "@/services/emerging-clusters";
import type { Database } from "@/types/database";
import type { EmergingCluster } from "@/types/intelligence";
import type {
  ChainRelevance,
  DigitalTribe,
  IntelligenceDashboard,
  IntelligenceStatus,
  NarrativeBubble,
  OpportunityRadarItem,
  RabbitHole,
  RelatedAsset,
  SourceInventoryItem,
  WeakSignal,
} from "@/types/intelligence-product";

export const EMPTY_INTELLIGENCE_MESSAGE =
  "No intelligence generated yet. Run analysis after collecting source data.";

type Supabase = SupabaseClient<Database>;

function titleCase(value: string): string {
  return value
    .split(" ")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function getClusterCategory(clusterName: string): string {
  const lowerName = clusterName.toLowerCase();

  if (lowerName.includes("agent")) {
    return "Agentic Systems";
  }

  if (lowerName.includes("payment") || lowerName.includes("x402")) {
    return "Machine Payments";
  }

  if (lowerName.includes("infra") || lowerName.includes("protocol")) {
    return "Crypto Infrastructure";
  }

  if (lowerName.includes("base") || lowerName.includes("solana")) {
    return "Chain-Specific Formation";
  }

  if (lowerName.includes("ai") || lowerName.includes("llm")) {
    return "AI";
  }

  return "Emerging Concept";
}

function getChainRelevance(cluster: EmergingCluster): ChainRelevance {
  const chains = new Set(
    cluster.related_coins.map((coin) => coin.chain.toLowerCase()),
  );

  if (chains.has("solana") && chains.has("base")) {
    return "Both";
  }

  if (chains.has("solana")) {
    return "Solana";
  }

  if (chains.has("base")) {
    return "Base";
  }

  return "Unknown";
}

function getStatus(evidenceCount: number): IntelligenceStatus {
  if (evidenceCount <= 5) {
    return "Very Early";
  }

  if (evidenceCount <= 15) {
    return "Early";
  }

  if (evidenceCount <= 40) {
    return "Growing";
  }

  if (evidenceCount <= 80) {
    return "Crowded";
  }

  return "Exhausted";
}

function clampScore(value: number): number {
  return Math.max(1, Math.min(100, Math.round(value)));
}

function getLeadTimeScore(cluster: EmergingCluster): number {
  const repositoryCount = cluster.related_repositories.length;
  const assetCount = cluster.related_coins.length;
  const earlyBonus = Math.max(0, 25 - cluster.evidence_count);
  const builderSignal = Math.min(35, repositoryCount * 3);
  const assetPenalty = Math.min(20, assetCount * 4);

  return clampScore(35 + earlyBonus + builderSignal - assetPenalty);
}

function getFinancializationPotential(cluster: EmergingCluster): number {
  const lowerName = cluster.cluster_name.toLowerCase();
  const assetSignal = Math.min(45, cluster.related_coins.length * 12);
  const keywordSignal =
    lowerName.includes("payment") ||
    lowerName.includes("commerce") ||
    lowerName.includes("base") ||
    lowerName.includes("solana")
      ? 25
      : 0;

  return clampScore(25 + assetSignal + keywordSignal);
}

function getInevitabilityScore(cluster: EmergingCluster): number {
  const builderSignal = Math.min(55, cluster.related_repositories.length * 4);
  const crossSourceSignal =
    cluster.related_repositories.length > 0 && cluster.related_coins.length > 0
      ? 20
      : 0;

  return clampScore(20 + builderSignal + crossSourceSignal);
}

function getHashPosition(value: string, salt: number): number {
  let hash = salt;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) % 1009;
  }

  return 12 + (hash % 76);
}

function getOwners(cluster: EmergingCluster): string[] {
  return [
    ...new Set(
      cluster.related_repositories
        .map((repository) => repository.repository.split("/")[0])
        .filter(Boolean),
    ),
  ].slice(0, 5);
}

function clusterToRabbitHole(cluster: EmergingCluster): RabbitHole {
  const repositoryCount = cluster.related_repositories.length;
  const assetCount = cluster.related_coins.length;

  return {
    id: cluster.cluster_name,
    name: titleCase(cluster.cluster_name),
    category: getClusterCategory(cluster.cluster_name),
    chain_relevance: getChainRelevance(cluster),
    core_thesis: `${titleCase(
      cluster.cluster_name,
    )} is recurring across ${repositoryCount} builder artifacts and ${assetCount} related assets.`,
    why_detected: `Detected from repeated language and topics across GitHub repositories plus attached Dexscreener asset evidence where present.`,
    evidence_count: cluster.evidence_count,
    lead_time_score: getLeadTimeScore(cluster),
    financialization_potential: getFinancializationPotential(cluster),
    inevitability_score: getInevitabilityScore(cluster),
    status: getStatus(cluster.evidence_count),
  };
}

function clusterToTribe(cluster: EmergingCluster): DigitalTribe {
  const formingOn = [
    cluster.related_repositories.length > 0 ? "GitHub" : null,
    cluster.related_coins.length > 0 ? "Dexscreener" : null,
  ].filter((source): source is string => source !== null);

  return {
    id: cluster.cluster_name,
    name: `${titleCase(cluster.cluster_name)} Tribe`,
    forming_on: formingOn,
    core_belief: `Builders and asset creators are repeatedly organizing around ${cluster.cluster_name}.`,
    top_accounts: getOwners(cluster),
    top_channels: [],
    related_repositories: cluster.related_repositories
      .map((repository) => repository.repository)
      .slice(0, 5),
    related_assets: cluster.related_coins
      .map((coin) => coin.symbol ?? coin.name)
      .filter((asset): asset is string => Boolean(asset))
      .slice(0, 5),
    conviction_level:
      cluster.related_repositories.length > 0 && cluster.related_coins.length > 0
        ? "Cross-source"
        : "Single-source",
  };
}

function clusterToBubble(cluster: EmergingCluster): NarrativeBubble {
  return {
    id: cluster.cluster_name,
    label: titleCase(cluster.cluster_name),
    kind: cluster.related_coins.length > 0 ? "opportunity_cluster" : "narrative",
    attention: clampScore(36 + cluster.evidence_count * 3),
    growth: clampScore(getLeadTimeScore(cluster)),
    conviction: clampScore(getInevitabilityScore(cluster)),
    x: getHashPosition(cluster.cluster_name, 17),
    y: getHashPosition(cluster.cluster_name, 43),
  };
}

function clusterToRadarItem(cluster: EmergingCluster): OpportunityRadarItem {
  return {
    id: cluster.cluster_name,
    name: titleCase(cluster.cluster_name),
    status: getStatus(cluster.evidence_count),
  };
}

function clusterToWeakSignal(cluster: EmergingCluster): WeakSignal {
  return {
    id: cluster.cluster_name,
    name: titleCase(cluster.cluster_name),
    evidence: `${cluster.evidence_count} repeated evidence points across ${cluster.related_repositories.length} repositories and ${cluster.related_coins.length} assets.`,
    why_it_may_matter:
      "Low-count repetition can be an early sign of a tribe, toolchain, or market language forming before broad attention arrives.",
    needs_confirmation:
      "Needs Farcaster/X conversation evidence, account clustering, and follow-on repository or asset growth.",
  };
}

function getRelatedAssets(clusters: EmergingCluster[]): RelatedAsset[] {
  const assets = new Map<string, RelatedAsset>();

  for (const cluster of clusters) {
    for (const coin of cluster.related_coins) {
      if (assets.has(coin.id)) {
        continue;
      }

      assets.set(coin.id, {
        id: coin.id,
        name: coin.name ?? "Unnamed asset",
        symbol: coin.symbol,
        chain: coin.chain,
        attached_to: titleCase(cluster.cluster_name),
      });
    }
  }

  return [...assets.values()].slice(0, 24);
}

function getBrief(clusters: EmergingCluster[], sourceDocuments: number) {
  if (clusters.length === 0) {
    return null;
  }

  const topClusters = clusters.slice(0, 5);
  const crossSourceClusters = clusters.filter(
    (cluster) =>
      cluster.related_repositories.length > 0 && cluster.related_coins.length > 0,
  );
  const weakClusters = clusters.filter((cluster) => cluster.evidence_count <= 8);

  return {
    changed_since_last_scan: `${sourceDocuments.toLocaleString()} source evidence items are available for deterministic analysis.`,
    new_rabbit_holes: topClusters
      .map((cluster) => titleCase(cluster.cluster_name))
      .join(", "),
    forming_narratives: topClusters
      .slice(0, 3)
      .map((cluster) => `${titleCase(cluster.cluster_name)} (${cluster.evidence_count})`)
      .join(", "),
    weak_signals:
      weakClusters.length > 0
        ? weakClusters
            .slice(0, 4)
            .map((cluster) => titleCase(cluster.cluster_name))
            .join(", ")
        : "No low-evidence weak signals detected in current deterministic pass.",
    early_conviction_opportunities:
      crossSourceClusters.length > 0
        ? crossSourceClusters
            .slice(0, 4)
            .map((cluster) => titleCase(cluster.cluster_name))
            .join(", ")
        : "No cross-source conviction clusters detected yet.",
    risks_or_delusion_warnings:
      "Farcaster is currently blocked by the Neynar plan, X/Twitter is not connected, and asset-only signals should be treated as weak until social/builder evidence confirms them.",
  };
}

function getAlerts(
  clusters: EmergingCluster[],
  sourceInventory: SourceInventoryItem[],
): IntelligenceDashboard["alerts"] {
  const alerts: IntelligenceDashboard["alerts"] = [];
  const farcaster = sourceInventory.find((source) => source.source === "Farcaster");
  const topCluster = clusters[0];
  const crossSourceCluster = clusters.find(
    (cluster) =>
      cluster.related_repositories.length > 0 && cluster.related_coins.length > 0,
  );

  if (topCluster) {
    alerts.push({
      id: `cluster-${topCluster.cluster_name}`,
      severity: "watch",
      title: `${titleCase(topCluster.cluster_name)} attention cluster`,
      detail: `${topCluster.evidence_count} evidence points detected across current source inventory.`,
      source: "Deterministic cluster engine",
    });
  }

  if (crossSourceCluster) {
    alerts.push({
      id: `cross-source-${crossSourceCluster.cluster_name}`,
      severity: "info",
      title: "Cross-source formation detected",
      detail: `${titleCase(
        crossSourceCluster.cluster_name,
      )} appears in both builder and asset evidence.`,
      source: "GitHub + Dexscreener",
    });
  }

  if (farcaster?.status === "Blocked") {
    alerts.push({
      id: "farcaster-blocked",
      severity: "warning",
      title: "Farcaster visibility blocked",
      detail:
        "Neynar plan blocks cast/channel/trending APIs, so tribe conversation evidence is missing.",
      source: "Neynar",
    });
  }

  return alerts;
}

async function getTableCount(
  supabase: Supabase | null,
  table: "coins" | "github_repos" | "raw_signals",
): Promise<number> {
  if (!supabase) {
    return 0;
  }

  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}

async function getLastScanAt(
  supabase: Supabase | null,
  source: string,
): Promise<string | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("scan_runs")
    .select("finished_at, started_at")
    .eq("source", source)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.finished_at ?? data?.started_at ?? null;
}

async function getSourceInventory(
  supabase: Supabase | null,
): Promise<SourceInventoryItem[]> {
  const [
    farcasterSignals,
    githubRepos,
    coins,
    farcasterLastScan,
    githubLastScan,
    dexscreenerLastScan,
  ] = await Promise.all([
    getTableCount(supabase, "raw_signals"),
    getTableCount(supabase, "github_repos"),
    getTableCount(supabase, "coins"),
    getLastScanAt(supabase, "farcaster"),
    getLastScanAt(supabase, "github"),
    getLastScanAt(supabase, "dexscreener"),
  ]);

  return [
    {
      source: "Farcaster",
      priority: 1,
      status: farcasterSignals > 0 ? "Collecting" : "Blocked",
      evidence_count: farcasterSignals,
      last_scan_at: farcasterLastScan,
    },
    {
      source: "GitHub",
      priority: 2,
      status: githubRepos > 0 ? "Collecting" : "Not Connected",
      evidence_count: githubRepos,
      last_scan_at: githubLastScan,
    },
    {
      source: "X/Twitter",
      priority: 3,
      status: "Not Connected",
      evidence_count: 0,
      last_scan_at: null,
    },
    {
      source: "Dexscreener",
      priority: 4,
      status: "Supporting Source",
      evidence_count: coins,
      last_scan_at: dexscreenerLastScan,
    },
  ];
}

export async function getIntelligenceDashboard(
  supabase: Supabase | null = null,
): Promise<IntelligenceDashboard> {
  const sourceInventory = await getSourceInventory(supabase);
  const sourceDocuments = sourceInventory.reduce(
    (total, source) => total + source.evidence_count,
    0,
  );
  const clusters = supabase ? (await getEmergingClusters(supabase)).clusters : [];
  const rabbitHoles = clusters.slice(0, 10).map(clusterToRabbitHole);
  const digitalTribes = clusters
    .filter((cluster) => cluster.related_repositories.length > 0)
    .slice(0, 8)
    .map(clusterToTribe);
  const weakSignals = clusters
    .filter((cluster) => cluster.evidence_count <= 8)
    .slice(0, 8)
    .map(clusterToWeakSignal);

  return {
    brief: getBrief(clusters, sourceDocuments),
    rabbit_holes: rabbitHoles,
    digital_tribes: digitalTribes,
    narrative_bubbles: clusters.slice(0, 18).map(clusterToBubble),
    opportunity_radar: clusters.slice(0, 18).map(clusterToRadarItem),
    weak_signals: weakSignals,
    related_assets: getRelatedAssets(clusters),
    source_inventory: sourceInventory,
    readiness: {
      source_documents: sourceDocuments,
      generated_briefs: clusters.length > 0 ? 1 : 0,
      detected_rabbit_holes: rabbitHoles.length,
      detected_tribes: digitalTribes.length,
      detected_narratives: clusters.length,
      weak_signals: weakSignals.length,
    },
    alerts: getAlerts(clusters, sourceInventory),
    generated_at: new Date().toISOString(),
  };
}
