import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type {
  IntelligenceDashboard,
  SourceInventoryItem,
} from "@/types/intelligence-product";

export const EMPTY_INTELLIGENCE_MESSAGE =
  "No intelligence generated yet. Run analysis after collecting source data.";

type Supabase = SupabaseClient<Database>;

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

  return {
    brief: null,
    rabbit_holes: [],
    digital_tribes: [],
    narrative_bubbles: [],
    opportunity_radar: [],
    weak_signals: [],
    related_assets: [],
    source_inventory: sourceInventory,
    readiness: {
      source_documents: sourceDocuments,
      generated_briefs: 0,
      detected_rabbit_holes: 0,
      detected_tribes: 0,
      detected_narratives: 0,
      weak_signals: 0,
    },
  };
}
