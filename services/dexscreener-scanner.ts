import type { SupabaseClient } from "@supabase/supabase-js";
import {
  fetchLatestTokenProfiles,
  fetchTokenPairs,
} from "@/lib/dexscreener";
import type { Database, Json } from "@/types/database";
import type {
  DexscreenerLink,
  DexscreenerPair,
  DexscreenerSupportedChain,
  DexscreenerTokenProfile,
} from "@/types/dexscreener";

const SUPPORTED_CHAINS: DexscreenerSupportedChain[] = ["solana", "base"];

type Supabase = SupabaseClient<Database>;
type CoinInsert = Database["public"]["Tables"]["coins"]["Insert"];
type SupportedTokenProfile = DexscreenerTokenProfile & {
  chainId: DexscreenerSupportedChain;
};
type ExistingCoin = Pick<
  Database["public"]["Tables"]["coins"]["Row"],
  "id" | "chain" | "pair_address" | "token_address"
>;

export type DexscreenerScanResult = {
  success: true;
  scanned: number;
  inserted: number;
  updated: number;
};

type CoinWriteResult =
  | {
      success: true;
      inserted: number;
      updated: number;
    }
  | {
      success: false;
      error: unknown;
    };

function isSupportedChain(chainId: string): chainId is DexscreenerSupportedChain {
  return SUPPORTED_CHAINS.includes(chainId as DexscreenerSupportedChain);
}

function isSupportedProfile(
  profile: DexscreenerTokenProfile,
): profile is SupportedTokenProfile {
  return isSupportedChain(profile.chainId);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function serializeError(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}

function normalizeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizePairCreatedAt(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getLinks(
  profile: DexscreenerTokenProfile | undefined,
  pair: DexscreenerPair,
): DexscreenerLink[] {
  return [
    ...(pair.info?.websites ?? []),
    ...(pair.info?.socials ?? []),
    ...(profile?.links ?? []),
  ];
}

function findLink(
  links: DexscreenerLink[],
  predicate: (link: DexscreenerLink) => boolean,
): string | null {
  return links.find((link) => link.url && predicate(link))?.url ?? null;
}

function getLinkType(link: DexscreenerLink): string {
  return `${link.type ?? ""} ${link.label ?? ""}`.toLowerCase();
}

function getWebsite(links: DexscreenerLink[]): string | null {
  return findLink(links, (link) => {
    const linkType = getLinkType(link);

    return (
      linkType.includes("website") ||
      (!linkType.includes("twitter") &&
        !linkType.includes("telegram") &&
        !link.url?.includes("x.com") &&
        !link.url?.includes("twitter.com") &&
        !link.url?.includes("t.me"))
    );
  });
}

function getXUrl(links: DexscreenerLink[]): string | null {
  return findLink(links, (link) => {
    const linkType = getLinkType(link);

    return (
      linkType.includes("twitter") ||
      linkType.includes("x") ||
      Boolean(link.url?.includes("x.com") || link.url?.includes("twitter.com"))
    );
  });
}

function getTelegramUrl(links: DexscreenerLink[]): string | null {
  return findLink(links, (link) => {
    const linkType = getLinkType(link);

    return linkType.includes("telegram") || Boolean(link.url?.includes("t.me"));
  });
}

function getCoinKey(coin: Pick<CoinInsert, "chain" | "token_address" | "pair_address">) {
  return `${coin.chain}:${coin.pair_address ?? coin.token_address}`;
}

function toCoinInsert(
  pair: DexscreenerPair,
  profile: DexscreenerTokenProfile | undefined,
): CoinInsert | null {
  const chain = pair.chainId;
  const tokenAddress = pair.baseToken?.address;

  if (!isSupportedChain(chain) || !tokenAddress) {
    return null;
  }

  const links = getLinks(profile, pair);
  const metadata: Json = {
    dexscreener_pair_url: pair.url ?? null,
    dexscreener_profile_url: profile?.url ?? null,
    description: profile?.description ?? null,
    quote_token: {
      address: pair.quoteToken?.address ?? null,
      name: pair.quoteToken?.name ?? null,
      symbol: pair.quoteToken?.symbol ?? null,
    },
  };

  return {
    chain,
    token_address: tokenAddress,
    pair_address: pair.pairAddress ?? null,
    name: pair.baseToken?.name ?? null,
    symbol: pair.baseToken?.symbol ?? null,
    dex: pair.dexId ?? null,
    market_cap: normalizeNumber(pair.marketCap),
    fdv: normalizeNumber(pair.fdv),
    liquidity_usd: normalizeNumber(pair.liquidity?.usd),
    volume_24h: normalizeNumber(pair.volume?.h24),
    pair_created_at: normalizePairCreatedAt(pair.pairCreatedAt),
    website: getWebsite(links),
    x_url: getXUrl(links),
    telegram_url: getTelegramUrl(links),
    metadata,
  };
}

function dedupeCoins(coins: CoinInsert[]): CoinInsert[] {
  return [...new Map(coins.map((coin) => [getCoinKey(coin), coin])).values()];
}

async function fetchSupportedPairs(): Promise<CoinInsert[]> {
  const profiles = await fetchLatestTokenProfiles();
  const supportedProfiles = profiles.filter(isSupportedProfile);

  const pairsByToken = await Promise.all(
    supportedProfiles.map(async (profile) => ({
      profile,
      pairs: await fetchTokenPairs(profile.chainId, profile.tokenAddress),
    })),
  );

  return dedupeCoins(
    pairsByToken.flatMap(({ profile, pairs }) =>
      pairs
        .map((pair) => toCoinInsert(pair, profile))
        .filter((coin): coin is CoinInsert => coin !== null),
    ),
  );
}

async function fetchExistingCoins(
  supabase: Supabase,
  coins: CoinInsert[],
): Promise<
  | {
      success: true;
      existingByKey: Map<string, ExistingCoin>;
    }
  | {
      success: false;
      error: unknown;
    }
> {
  const pairAddresses = coins
    .map((coin) => coin.pair_address)
    .filter((pairAddress): pairAddress is string => Boolean(pairAddress));

  if (pairAddresses.length === 0) {
    return { success: true, existingByKey: new Map() };
  }

  const { data, error } = await supabase
    .from("coins")
    .select("id, chain, pair_address, token_address")
    .in("pair_address", pairAddresses);

  if (error) {
    return { success: false, error };
  }

  return {
    success: true,
    existingByKey: new Map(
      (data ?? []).map((coin) => [getCoinKey(coin), coin]),
    ),
  };
}

async function writeCoins(
  supabase: Supabase,
  coins: CoinInsert[],
): Promise<CoinWriteResult> {
  const existingResult = await fetchExistingCoins(supabase, coins);

  if (!existingResult.success) {
    return existingResult;
  }

  const now = new Date().toISOString();
  const coinsToInsert: CoinInsert[] = [];
  const coinsToUpdate: Array<{ id: string; coin: CoinInsert }> = [];

  for (const coin of coins) {
    const existingCoin = existingResult.existingByKey.get(getCoinKey(coin));

    if (existingCoin) {
      coinsToUpdate.push({ id: existingCoin.id, coin });
    } else {
      coinsToInsert.push({ ...coin, updated_at: now });
    }
  }

  if (coinsToInsert.length > 0) {
    const { error } = await supabase.from("coins").insert(coinsToInsert);

    if (error) {
      return { success: false, error };
    }
  }

  for (const { id, coin } of coinsToUpdate) {
    const { error } = await supabase
      .from("coins")
      .update({ ...coin, updated_at: now })
      .eq("id", id);

    if (error) {
      return { success: false, error };
    }
  }

  return {
    success: true,
    inserted: coinsToInsert.length,
    updated: coinsToUpdate.length,
  };
}

export async function scanDexscreener(
  supabase: Supabase,
): Promise<DexscreenerScanResult> {
  const { data: scanRun, error: scanRunError } = await supabase
    .from("scan_runs")
    .insert({
      source: "dexscreener",
      status: "started",
    })
    .select("id")
    .single();

  if (scanRunError) {
    throw scanRunError;
  }

  try {
    const coins = await fetchSupportedPairs();
    const writeResult = await writeCoins(supabase, coins);

    if (!writeResult.success) {
      throw writeResult.error;
    }

    const result: DexscreenerScanResult = {
      success: true,
      scanned: coins.length,
      inserted: writeResult.inserted,
      updated: writeResult.updated,
    };

    const { error: finishError } = await supabase
      .from("scan_runs")
      .update({
        status: "success",
        finished_at: new Date().toISOString(),
        error: null,
      })
      .eq("id", scanRun.id);

    if (finishError) {
      throw finishError;
    }

    return result;
  } catch (error) {
    await supabase
      .from("scan_runs")
      .update({
        status: "failed",
        finished_at: new Date().toISOString(),
        error: serializeError(error),
      })
      .eq("id", scanRun.id);

    throw error;
  }
}
