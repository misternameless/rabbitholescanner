import { getNeynarConfig } from "@/lib/env";
import type {
  NeynarApiError,
  NeynarCastSearchResponse,
  NeynarChannelSearchResponse,
  NeynarFeedResponse,
} from "@/types/neynar";

export const NEYNAR_API_BASE_URL = "https://api.neynar.com";

export function isNeynarConfigured(): boolean {
  return getNeynarConfig() !== null;
}

export function getNeynarHeaders(): HeadersInit | null {
  const config = getNeynarConfig();

  if (!config) {
    return null;
  }

  return {
    "x-api-key": config.apiKey,
    Accept: "application/json",
  };
}

async function fetchNeynarJson<T>(path: string): Promise<T> {
  const headers = getNeynarHeaders();

  if (!headers) {
    throw {
      status: 500,
      statusText: "Missing Neynar configuration",
      body: "NEYNAR_API_KEY is missing.",
    } satisfies NeynarApiError;
  }

  const response = await fetch(`${NEYNAR_API_BASE_URL}${path}`, {
    headers,
    cache: "no-store",
  });
  const body = await response.json().catch(async () => response.text());

  if (!response.ok) {
    throw {
      status: response.status,
      statusText: response.statusText,
      body,
    } satisfies NeynarApiError;
  }

  return body as T;
}

export function searchNeynarCasts(
  query: string,
  limit = 10,
): Promise<NeynarCastSearchResponse> {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    mode: "literal",
    sort_type: "desc_chron",
  });

  return fetchNeynarJson<NeynarCastSearchResponse>(
    `/v2/farcaster/cast/search?${params.toString()}`,
  );
}

export function searchNeynarChannels(
  query: string,
  limit = 5,
): Promise<NeynarChannelSearchResponse> {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
  });

  return fetchNeynarJson<NeynarChannelSearchResponse>(
    `/v2/farcaster/channel/search/?${params.toString()}`,
  );
}

export function fetchNeynarTrendingFeed(
  limit = 25,
): Promise<NeynarFeedResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    time_window: "24h",
    provider: "neynar",
  });

  return fetchNeynarJson<NeynarFeedResponse>(
    `/v2/farcaster/feed/trending?${params.toString()}`,
  );
}
