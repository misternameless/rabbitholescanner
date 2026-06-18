import type {
  DexscreenerPair,
  DexscreenerSupportedChain,
  DexscreenerTokenProfile,
} from "@/types/dexscreener";

export const DEXSCREENER_API_BASE_URL = "https://api.dexscreener.com";

export function getDexscreenerBaseUrl(): string {
  return DEXSCREENER_API_BASE_URL;
}

async function fetchDexscreenerJson<T>(path: string): Promise<T> {
  const response = await fetch(`${DEXSCREENER_API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw {
      status: response.status,
      statusText: response.statusText,
      body: await response.text(),
    };
  }

  return response.json() as Promise<T>;
}

export function fetchLatestTokenProfiles(): Promise<DexscreenerTokenProfile[]> {
  return fetchDexscreenerJson<DexscreenerTokenProfile[]>(
    "/token-profiles/latest/v1",
  );
}

export function fetchTokenPairs(
  chain: DexscreenerSupportedChain,
  tokenAddress: string,
): Promise<DexscreenerPair[]> {
  return fetchDexscreenerJson<DexscreenerPair[]>(
    `/token-pairs/v1/${encodeURIComponent(chain)}/${encodeURIComponent(
      tokenAddress,
    )}`,
  );
}
