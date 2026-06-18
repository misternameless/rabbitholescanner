import type { SupabaseClient } from "@supabase/supabase-js";
import type { DashboardData, CoinOpportunity } from "@/types/dashboard";
import type { Database } from "@/types/database";

type Supabase = SupabaseClient<Database>;
type CoinRow = Pick<
  Database["public"]["Tables"]["coins"]["Row"],
  | "id"
  | "name"
  | "symbol"
  | "market_cap"
  | "liquidity_usd"
  | "volume_24h"
>;

const EMPTY_DASHBOARD_DATA: DashboardData = {
  scanStatistics: {
    coinsScanned: 0,
    totalCoins: 0,
    lastScanTime: null,
  },
  solanaOpportunities: [],
  baseOpportunities: [],
};

function toOpportunity(coin: CoinRow): CoinOpportunity {
  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    marketCap: coin.market_cap,
    liquidity: coin.liquidity_usd,
    volume: coin.volume_24h,
  };
}

async function getCoinsScannedInLatestRun(
  supabase: Supabase,
  startedAt: string | null,
  finishedAt: string | null,
): Promise<number> {
  if (!startedAt) {
    return 0;
  }

  let query = supabase
    .from("coins")
    .select("id", { count: "exact", head: true })
    .gte("updated_at", startedAt);

  if (finishedAt) {
    query = query.lte("updated_at", finishedAt);
  }

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function getDashboardData(
  supabase: Supabase | null,
): Promise<DashboardData> {
  if (!supabase) {
    return EMPTY_DASHBOARD_DATA;
  }

  const [
    totalCoinsResult,
    latestScanResult,
    solanaResult,
    baseResult,
  ] = await Promise.all([
    supabase.from("coins").select("id", { count: "exact", head: true }),
    supabase
      .from("scan_runs")
      .select("started_at, finished_at")
      .eq("source", "dexscreener")
      .eq("status", "success")
      .order("finished_at", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("coins")
      .select("id, name, symbol, market_cap, liquidity_usd, volume_24h")
      .eq("chain", "solana")
      .order("updated_at", { ascending: false })
      .limit(10),
    supabase
      .from("coins")
      .select("id, name, symbol, market_cap, liquidity_usd, volume_24h")
      .eq("chain", "base")
      .order("updated_at", { ascending: false })
      .limit(10),
  ]);

  if (totalCoinsResult.error) {
    throw totalCoinsResult.error;
  }

  if (latestScanResult.error) {
    throw latestScanResult.error;
  }

  if (solanaResult.error) {
    throw solanaResult.error;
  }

  if (baseResult.error) {
    throw baseResult.error;
  }

  const latestScan = latestScanResult.data;
  const lastScanTime = latestScan?.finished_at ?? latestScan?.started_at ?? null;
  const coinsScanned = await getCoinsScannedInLatestRun(
    supabase,
    latestScan?.started_at ?? null,
    latestScan?.finished_at ?? null,
  );

  return {
    scanStatistics: {
      coinsScanned,
      totalCoins: totalCoinsResult.count ?? 0,
      lastScanTime,
    },
    solanaOpportunities: (solanaResult.data ?? []).map(toOpportunity),
    baseOpportunities: (baseResult.data ?? []).map(toOpportunity),
  };
}
